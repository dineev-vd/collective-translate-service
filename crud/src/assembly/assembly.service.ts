import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assembly } from 'entities/assembly.entity';
import * as fs from 'fs/promises';
import { InjectS3, S3 } from 'nestjs-s3';
import { Repository } from 'typeorm';

@Injectable()
export class AssemblyService {
  constructor(
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
    @InjectS3() private readonly s3: S3,
  ) {}

  async getAssemblyById(id: string) {
    return this.assemblyRepository.findOne({ where: { id } });
  }

  async getAssembliesByLanguageId(id: string) {
    return this.assemblyRepository.find({ where: { language: { id: id } } });
  }

  async deleteAssembliesByLanguage(id: string) {
    const assemblies = await this.getAssembliesByLanguageId(id);
    if (assemblies.length > 0) {
      await this.assemblyRepository.delete(assemblies.map((a) => a.id));
      return Promise.all(
        assemblies.map(async (assembly) => {
          return fs.rm(assembly.path);
        }),
      );
    }
  }
}

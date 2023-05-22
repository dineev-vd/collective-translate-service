import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectTag } from 'entities/projecttag.enity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(ProjectTag)
    private readonly tagsRepository: Repository<ProjectTag>,
  ) {}

  async getTagsByQuery(query: string) {
    return this.tagsRepository.find({ where: { id: ILike(`%${query}%`) } });
  }
}

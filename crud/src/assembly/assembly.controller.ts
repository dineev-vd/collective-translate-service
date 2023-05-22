import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InjectS3, S3 } from 'nestjs-s3';
import { Readable } from 'typeorm/platform/PlatformTools';
import { AssemblyService } from './assembly.service';

@Controller('assembly')
export class AssemblyController {
  constructor(
    private readonly assemblyService: AssemblyService,
    @InjectS3() private readonly s3: S3,
  ) {}

  @Get(':id')
  async getAssemblyById(@Param('id') assemblyId: string, @Res() res: Response) {
    const assembly = await this.assemblyService.getAssemblyById(assemblyId);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURI(assembly.name)}`,
    );
    Readable.from(
      Buffer.from(
        await (
          await this.s3.getObject({ Bucket: 'assemblies', Key: assembly.path })
        ).Body.transformToByteArray(),
      ),
    ).pipe(res);
  }
}

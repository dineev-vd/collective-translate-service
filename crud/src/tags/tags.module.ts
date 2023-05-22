import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTag } from 'entities/projecttag.enity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTag])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { Glossary } from 'entities/glossary.entity';
import { GlossaryEntry } from 'entities/glossaryEntry.entity';
import { GlossaryController } from './glossary.controller';
import { GlossaryService } from './glossary.service';

@Module({
  providers: [GlossaryService],
  controllers: [GlossaryController],
  imports: [TypeOrmModule.forFeature([Glossary, GlossaryEntry, Comment])],
  exports: [GlossaryService],
})
export class GlossaryModule {}

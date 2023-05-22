import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from 'actions/actions.module';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { Glossary } from 'entities/glossary.entity';
import Project from 'entities/project.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { FilesModule } from 'files/files.module';
import { LanguageModule } from 'language/language.module';
import { TranslationModule } from 'translation/translation.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  controllers: [ProjectController],
  imports: [
    TranslationModule,
    FilesModule,
    ActionsModule,
    LanguageModule,
    TypeOrmModule.forFeature([
      Project,
      SegmentTranslation,
      Action,
      File,
      Glossary,
    ]),
  ],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}

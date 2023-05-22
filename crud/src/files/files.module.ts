import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'entities/file.entity';
import { TranslationModule } from 'translation/translation.module';
import { LanguageModule } from 'language/language.module';
import { Assembly } from 'entities/assembly.entity';
import { ActionsModule } from 'actions/actions.module';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    TypeOrmModule.forFeature([File, Assembly]),
    TranslationModule,
    forwardRef(() => LanguageModule),
    ActionsModule,
  ],
  exports: [FilesService],
})
export class FilesModule {}

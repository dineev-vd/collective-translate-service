import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from 'actions/actions.module';
import { Assembly } from 'entities/assembly.entity';
import { File } from 'entities/file.entity';
import { LanguageModule } from 'language/language.module';
import { TranslationModule } from 'translation/translation.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    BullModule.registerQueue({
      name: 'ready_files',
    }),
    TypeOrmModule.forFeature([File, Assembly]),
    TranslationModule,
    forwardRef(() => LanguageModule),
    ActionsModule,
  ],
  exports: [FilesService],
})
export class FilesModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssemblyModule } from 'assembly/assembly.module';
import { Glossary } from 'entities/glossary.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { FilesModule } from 'files/files.module';
import { TranslationModule } from 'translation/translation.module';
import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

@Module({
  providers: [LanguageService],
  imports: [
    TypeOrmModule.forFeature([TranslationLanguage, Glossary]),
    forwardRef(() => TranslationModule),
    forwardRef(() => FilesModule),
    AssemblyModule,
  ],
  controllers: [LanguageController],
  exports: [LanguageService],
})
export class LanguageModule {}

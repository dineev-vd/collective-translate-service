import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Glossary } from 'entities/glossary.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(TranslationLanguage)
    private readonly languageRepository: Repository<TranslationLanguage>,
    @InjectRepository(Glossary)
    private readonly glossaryRepository: Repository<Glossary>,
  ) {}

  async getGlossary(id: string) {
    return this.glossaryRepository.findOne({
      where: { language: { id } },
      relations: { entries: true },
    });
  }

  async getTranslationLanguageById(id: string) {
    return this.languageRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async getTranslationLanguagesByProjectId(projectId: string) {
    return this.languageRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async saveLanguage(language: DeepPartial<TranslationLanguage>) {
    return this.languageRepository.save(language);
  }

  async getOriginalLanguage(projectId: string) {
    return this.languageRepository.findOne({
      where: { project: { id: projectId }, original: true },
    });
  }
}

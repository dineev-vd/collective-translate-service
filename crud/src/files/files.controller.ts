import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FILE_ENDPOINT } from 'common/constants';
import { LanguageService } from 'language/language.service';
import { TranslationService } from 'translation/translation.service';
import { FilesService } from './files.service';

@Controller(FILE_ENDPOINT)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly translationsService: TranslationService,
    private readonly languageService: LanguageService,
  ) {}

  @Post(`:id/peek`)
  async getPeek(@Param('id') id: string, @Body('regexp') regexp?: string) {
    return this.filesService.peekFileById(id, 5000, regexp);
  }

  @Post(`:id/split`)
  async splitFile(@Param('id') id: string, @Body('regexp') regexp?: string) {
    const process = async () => {
      const file = await this.filesService.getFileById(id);
      await this.filesService.splitFile(id, regexp);
      const languages =
        await this.languageService.getTranslationLanguagesByProjectId(
          file.projectId,
        );

      const originalLang = languages.find((l) => l.original);
      const translateLangs = languages.filter((l) => !l.original);

      return Promise.all(
        translateLangs.map(async (language) => {
          return this.translationsService.generateTranslationForFile(
            language.id,
            id,
            originalLang.id,
          );
        }),
      );
    };

    // process();

    return process();
  }

  @Get(`:id/assemble`)
  async assembleFile(
    @Param('id') id: string,
    @Query('languageId') languageId: string,
  ) {
    return this.filesService.assembleFile(id, languageId);
  }
}

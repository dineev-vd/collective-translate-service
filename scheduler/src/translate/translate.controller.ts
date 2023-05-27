import { Controller, Param, Post, Query } from '@nestjs/common';
import { TranslateService } from './translate.service';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post(':id/queueTranslation') async queueTranslation(
    @Param('id') languageId: string,
    @Query('type') type: 'argos' | 'yandex',
  ) {
    return this.translateService.queueLanguage(languageId, type);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TranslationInputterService } from './translationInputter.service';

@Controller()
export class TranslationInputter {
  constructor(
    private readonly translationInputterService: TranslationInputterService,
  ) {}

  @MessagePattern({ cmd: 'put_translated_segments' })
  async putTranslatedSegments(
    data: {
      id: string;
      type: string;
      translationText: string;
    }[],
  ) {
    return this.translationInputterService.putTranslations(data);
  }
}

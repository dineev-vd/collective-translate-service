import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class TranslateService {
  constructor(
    @InjectQueue('pending_languages')
    private languageQueue: Queue,
  ) {}

  queueLanguage(languageId: string) {
    this.languageQueue.add({ languageId });
  }
}

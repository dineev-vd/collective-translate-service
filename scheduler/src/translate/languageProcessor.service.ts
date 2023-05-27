import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job, Queue } from 'bull';

@Processor('pending_languages')
export class LanguageProcessor {
  constructor(
    @Inject('CRUD') private crud: ClientProxy,
    @InjectQueue('argos_pending_segments')
    private argosQueue: Queue,
    @InjectQueue('yandex_pending_segments')
    private yandexQueue: Queue,
  ) {}

  @Process({ concurrency: 1 })
  async translate(job: Job<{ languageId: string; type: 'argos' | 'yandex' }>) {
    const pattern = { cmd: 'get_language_segments' };
    const payload = job.data.languageId;

    const segmentsObservable = this.crud.send<
      {
        id: string;
        text: string;
        fromLanguage: string;
        toLanguage: string;
      }[]
    >(pattern, payload);

    switch (job.data.type) {
      case 'argos':
        segmentsObservable.subscribe({
          next: (segments) =>
            this.argosQueue.addBulk(
              segments.map((segment) => ({ data: segment })),
            ),
        });
        break;

      case 'yandex':
        segmentsObservable.subscribe({
          next: (segments) =>
            this.yandexQueue.addBulk(
              segments.map((segment) => ({ data: segment })),
            ),
        });
        break;
    }

    job.finished();
  }
}

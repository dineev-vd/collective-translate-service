import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job, Queue } from 'bull';

@Processor('pending_languages')
export class LanguageProcessor {
  constructor(
    @Inject('CRUD') private crud: ClientProxy,
    @InjectQueue('pending_segments')
    private segmentsQueue: Queue,
  ) {}

  @Process({ concurrency: 1 })
  async translate(job: Job<{ languageId: string }>) {
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

    segmentsObservable.subscribe({
      next: (segments) =>
        this.segmentsQueue.addBulk(
          segments.map((segment) => ({ data: segment })),
        ),
    });

    job.finished();
  }
}

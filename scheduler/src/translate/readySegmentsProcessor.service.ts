import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bull';

@Processor('ready_segments')
export class ReadySegmentsProcessor {
  constructor(@Inject('CRUD') private crud: ClientProxy) {}

  @Process({ concurrency: 1 })
  async putTranslations(
    job: Job<{ id: string; translationText: string; type: string }>,
  ) {
    const pattern = { cmd: 'put_translated_segments' };
    const payload = [job.data];

    // job.takeLock();

    this.crud.send(pattern, payload).subscribe();
  }
}

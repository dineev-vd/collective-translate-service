import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bull';

@Processor('ready_files')
export class ReadyFilesProcessor {
  constructor(@Inject('CRUD') private crud: ClientProxy) {}

  @Process({ concurrency: 1 })
  async putTranslations(job: Job<any>) {
    const pattern = { cmd: 'put_ready_files' };
    const payload = job.data;

    // job.takeLock();
    console.log(job);

    this.crud.send(pattern, payload).subscribe();
  }
}

import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job, Queue } from 'bull';

@Processor('pending_files')
export class SplitProcessor {
  constructor(
    @Inject('CRUD') private crud: ClientProxy,
    @InjectQueue('files_to_parse')
    private filesToParseQueue: Queue,
  ) {}

  @Process({ concurrency: 1 })
  async translate(job: Job<{ id: string; regexp?: string }>) {
    const pattern = { cmd: 'get_file_info' };
    const payload = job.data.id;

    const fileInfoObservable = await this.crud
      .send<{
        key: string;
        bucket: string;
        name: string;
        encoding: string;
      }>(pattern, payload)
      .toPromise();

    this.filesToParseQueue.add({
      ...fileInfoObservable,
      regexp: job.data.regexp,
    });

    job.finished();
  }
}

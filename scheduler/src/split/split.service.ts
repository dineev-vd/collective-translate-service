import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class SplitService {
  constructor(
    @InjectQueue('pending_files')
    private filesQueue: Queue,
  ) {}

  async queueSplit(id: string, regexp?: string) {
    return this.filesQueue.add({ id, regexp });
  }
}

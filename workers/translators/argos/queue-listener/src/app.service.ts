import { HttpService } from '@nestjs/axios';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { AxiosResponse } from 'axios';
import { Job, Queue } from 'bull';

//
@Processor('argos_pending_segments')
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('ready_segments')
    private readyQueue: Queue,
  ) {}

  @Process({ concurrency: 1 })
  async translate(
    job: Job<{
      id: string;
      text: string;
      fromLanguage: string;
      toLanguage: string;
    }>,
  ) {
    let res: AxiosResponse<any, any>;

    while (true) {
      try {
        res = await this.httpService
          .post(
            'http://argos-translator:7878/translate',
            {
              text: job.data.text,
              from: job.data.fromLanguage,
              to: job.data.toLanguage,
            },
            { timeout: 30000 },
          )
          .toPromise();
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      break;
    }

    job.finished();
    console.log(res.data);

    this.readyQueue.add(
      {
        id: job.data.id,
        translationText: res.data.translation,
        type: 'argos',
      },
      { removeOnComplete: true },
    );

    console.log('inserted in ready queue');

    return {};
  }
}

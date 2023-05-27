import { HttpService } from '@nestjs/axios';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { AxiosResponse } from 'axios';
import { Job, Queue } from 'bull';

const {
  TRANSLATE_API_URL,
  YANDEX_FOLDER_ID,
  IAM_ENDPOINT,
  YANDEX_OAUTH_TOKEN,
} = process.env;

console.log({
  TRANSLATE_API_URL,
  YANDEX_FOLDER_ID,
  IAM_ENDPOINT,
  YANDEX_OAUTH_TOKEN,
});

//
@Processor('yandex_pending_segments')
export class AppService {
  private iamToken: string;

  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('ready_segments')
    private readyQueue: Queue,
  ) {}

  async getIAMToken() {
    const response = await this.httpService
      .post(IAM_ENDPOINT, {
        yandexPassportOauthToken: YANDEX_OAUTH_TOKEN,
      })
      .toPromise();

    console.log(response);

    return response.data['iamToken'] as string;
  }

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
            TRANSLATE_API_URL,
            {
              folderId: YANDEX_FOLDER_ID,
              texts: [job.data.text],
              targetLanguageCode: job.data.toLanguage,
              sourceLanguageCode: job.data.fromLanguage,
            },
            {
              timeout: 30000,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.iamToken}`,
              },
            },
          )
          .toPromise();
      } catch (e) {
        if (e.response.status === 401) {
          this.iamToken = await this.getIAMToken();
        }

        console.log(e.response.data);
        await new Promise((r) => setTimeout(r, 10000));
        continue;
      }
      break;
    }

    job.finished();
    console.log(res.data);

    this.readyQueue.add(
      {
        id: job.data.id,
        translationText: res.data.translations[0].text,
        type: 'yandex',
      },
      { removeOnComplete: true },
    );

    console.log('inserted in ready queue');

    return {};
  }
}

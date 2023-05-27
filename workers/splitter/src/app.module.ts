import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { S3Module } from 'nestjs-s3';
import { AppService } from './app.service';

const { S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

@Module({
  imports: [
    S3Module.forRootAsync({
      useFactory: async () => ({
        config: {
          credentials: {
            accessKeyId: S3_ACCESS_KEY_ID,
            secretAccessKey: S3_SECRET_ACCESS_KEY,
          },
          forcePathStyle: true,
          endpoint: S3_ENDPOINT,
          region: 'us-east-1',
        },
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'host.docker.internal',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'ready_files',
      },
      { name: 'files_to_parse' },
    ),
  ],
  providers: [AppService],
})
export class AppModule {}

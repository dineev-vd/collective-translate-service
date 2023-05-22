import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SplitModule } from './split/split.module';
import { TranslateModule } from './translate/translate.module';

@Module({
  imports: [
    SplitModule,
    TranslateModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

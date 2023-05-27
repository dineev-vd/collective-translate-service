import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    BullModule.forRoot({
      redis: {
        host: 'host.docker.internal',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'yandex_pending_segments',
      },
      { name: 'ready_segments' },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LanguageProcessor } from './languageProcessor.service';
import { ReadySegmentsProcessor } from './readySegmentsProcessor.service';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pending_languages',
    }),
    BullModule.registerQueue({
      name: 'pending_segments',
    }),
    BullModule.registerQueue({
      name: 'ready_segments',
    }),
    ClientsModule.register([
      {
        name: 'CRUD',
        transport: Transport.TCP,
        options: { port: 10000, host: 'backend' },
      },
    ]),
  ],
  controllers: [TranslateController],
  providers: [TranslateService, LanguageProcessor, ReadySegmentsProcessor],
})
export class TranslateModule {}

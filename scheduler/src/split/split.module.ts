import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReadyFilesProcessor } from './readyFilesProcessor.service';
import { SplitController } from './split.controller';
import { SplitService } from './split.service';
import { SplitProcessor } from './splitProcessor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'pending_files',
    }),
    BullModule.registerQueue({
      name: 'ready_files',
    }),
    BullModule.registerQueue({
      name: 'files_to_parse',
    }),
    ClientsModule.register([
      {
        name: 'CRUD',
        transport: Transport.TCP,
        options: { port: 10000, host: 'crud' },
      },
    ]),
  ],
  controllers: [SplitController],
  providers: [SplitService, SplitProcessor, ReadyFilesProcessor],
})
export class SplitModule {}

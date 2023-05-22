import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assembly } from 'entities/assembly.entity';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';

@Module({
  controllers: [AssemblyController],
  providers: [AssemblyService],
  imports: [TypeOrmModule.forFeature([Assembly])],
  exports: [AssemblyService]
})
export class AssemblyModule {}

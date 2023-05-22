import { Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegularExpression } from 'entities/regexp.entity';
import { RegexpController } from './regexp.controller';
import { RegexpService } from './regexp.service';

@Module({
  controllers: [RegexpController],
  providers: [RegexpService],
  imports: [TypeOrmModule.forFeature([RegularExpression])]
})
export class RegexpModule { }

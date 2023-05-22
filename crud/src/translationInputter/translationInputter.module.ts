import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TranslationInputter } from './translationInputter.controller';
import { TranslationInputterService } from './translationInputter.service';

@Module({
  controllers: [TranslationInputter],
  imports: [TypeOrmModule.forFeature([SegmentTranslation])],
  providers: [TranslationInputterService],
  exports: [],
})
export class TranslationInputterModule {}

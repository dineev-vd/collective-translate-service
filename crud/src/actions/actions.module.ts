import { forwardRef, Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'entities/action.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { TranslationModule } from 'translation/translation.module';

@Module({
  providers: [ActionsService],
  imports: [
    TypeOrmModule.forFeature([Action, SegmentTranslation]),
  ],
  exports: [ActionsService],
})
export class ActionsModule {}

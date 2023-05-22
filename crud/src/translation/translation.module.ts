import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from 'actions/actions.module';
import { Action } from 'entities/action.entity';
import { Comment } from 'entities/comment.entity';
import { JobResult } from 'entities/jobresult.entity';
import SegmentTranslation from 'entities/segment-translation.entity';
import { LanguageModule } from 'language/language.module';
import { SuggestionsModule } from 'suggestions/suggestions.module';
import { PiecesController } from './translation.controller';
import { TranslationService } from './translation.service';
//
@Module({
  controllers: [PiecesController],
  imports: [
    BullModule.registerQueue({
      name: 'pendingSegments',
    }),
    TypeOrmModule.forFeature([SegmentTranslation, Action, JobResult, Comment]),
    LanguageModule,
    forwardRef(() => SuggestionsModule),
    forwardRef(() => ActionsModule),
  ],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}

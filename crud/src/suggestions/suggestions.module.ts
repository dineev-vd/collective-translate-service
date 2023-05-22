import { forwardRef, Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suggestion } from 'entities/suggestion.entity';
import { TranslationModule } from 'translation/translation.module';

@Module({
  providers: [SuggestionsService],
  controllers: [SuggestionsController],
  exports: [SuggestionsService],
  imports: [TypeOrmModule.forFeature([Suggestion]), forwardRef(() => TranslationModule)]
})
export class SuggestionsModule {}

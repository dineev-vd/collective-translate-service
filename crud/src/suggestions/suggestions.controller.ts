import {
  Controller,
  ForbiddenException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { TranslationService } from 'translation/translation.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly suggestionService: SuggestionsService,
    private readonly translationService: TranslationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approve(@Param('id') id: string, @Req() { user }: ExtendedRequest) {
    const segment = await this.suggestionService.getSegmentBySuggestion(id);
    const project = await this.translationService.getProjectBySegment(
      segment.id,
    );

    if (!(project.editorsId.includes(user.id) || project.ownerId == user.id)) {
      throw new ForbiddenException();
    }

    return this.suggestionService.approveSuggestion(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/deny')
  async deny(@Param('id') id: string, @Req() { user }: ExtendedRequest) {
    const segment = await this.suggestionService.getSegmentBySuggestion(id);
    const project = await this.translationService.getProjectBySegment(
      segment.id,
    );

    if (!(project.editorsId.includes(user.id) || project.ownerId == user.id)) {
      throw new ForbiddenException();
    }

    return this.suggestionService.denySuggestion(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  async vote(@Param('id') id: string, @Req() { user }: ExtendedRequest) {
    return this.suggestionService.vote(id, user);
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from 'actions/actions.service';
import { TRANSLATION_ENDPOINT } from 'common/constants';
import { LanguageService } from 'language/language.service';
import { TranslationService } from './translation.service';

import { MessagePattern } from '@nestjs/microservices';
import { PostTranslationDto } from 'common/dto/translate-piece.dto';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { SuggestionsService } from 'suggestions/suggestions.service';
import { ExtendedRequest } from 'util/ExtendedRequest';

@Controller(TRANSLATION_ENDPOINT)
export class PiecesController {
  constructor(
    private readonly actionsService: ActionsService,
    private readonly translationService: TranslationService,
    private readonly languageService: LanguageService,
    private readonly suggestionService: SuggestionsService,
  ) {}

  @Get(':id/comments')
  async getComments(@Param('id') postId: string) {
    return this.translationService.getComments(postId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async postComment(
    @Param('id') postId: string,
    @Req() { user }: ExtendedRequest,
    @Body() { text }: { text: string },
  ) {
    return this.translationService.postComment(postId, {
      author: user,
      comment: text,
    });
  }

  @Get(':id/suggestions') async getSuggestions(@Param('id') segmentId: string) {
    return this.suggestionService.getSuggestiont(segmentId);
  }

  @Get(':id/jobresults') async getJobResults(@Param('id') segmentId: string) {
    return this.translationService.getJobResults(segmentId);
  }

  @Post(':id/queueTranslation') async queueTranslation(
    @Param('id') languageId: string,
  ) {
    return this.translationService.queuePieces(languageId);
  }

  @Get(':id')
  async getTextPieceById(
    @Param('id') id: string,
    @Query('nextMinLength') nextMinLength?: number,
    @Query('prevMinLength') prevMinLength?: number,
    @Query('toLanguageId') toLanguageId?: string,
    @Query('withOriginal') withOriginal?: boolean,
  ) {
    return this.translationService.getSegmentWithNeighbours(id, {
      prev: prevMinLength,
      next: nextMinLength,
      toLanguageId: toLanguageId,
      withOriginal: withOriginal,
    });
  }

  @Get(':id/actions')
  async getActions(@Param('id') segmentId: string) {
    return this.actionsService.getActionsBySegment(segmentId);
  }

  @Get(':id/languages')
  async getLanguages(@Param('id') segmentId: string) {
    const project = await this.translationService.getProjectBySegment(
      segmentId,
    );
    return this.languageService.getTranslationLanguagesByProjectId(project.id);
  }

  @Get(':id/language')
  async getLanguage(@Param('id') segmentId: string) {
    return this.translationService.getLanguageBySegment(segmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/suggest')
  async suggest(
    @Param('id') segmentId: string,
    @Body() { suggestion }: { suggestion: string },
    @Req() { user }: ExtendedRequest,
  ) {
    return this.suggestionService.suggestTranslation(
      segmentId,
      suggestion,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async putTranslations(
    @Req() { user }: ExtendedRequest,
    @Body() changes: PostTranslationDto[],
  ) {
    const project = await this.translationService.getProjectBySegment(
      changes[0].id,
    );

    if (!(project.editorsId.includes(user.id) || project.ownerId == user.id)) {
      throw new ForbiddenException();
    }

    return this.translationService.putTranslations(changes, user);
  }

  @Get(':id/similar')
  async getSimilarTranslations(@Param('id') id: string) {
    return this.translationService.getSimilarPieces(id);
  }

  @MessagePattern({ cmd: 'get_language_segments' })
  async getLanguageSegments(
    languageId: string,
  ): Promise<
    { id: string; text: string; fromLanguage: string; toLanguage: string }[]
  > {
    const segments = await this.translationService.getTranslationsByLanguage({
      languageId,
    });
    const language = await this.languageService.getTranslationLanguageById(
      languageId,
    );
    const originalLanguage = await this.languageService.getOriginalLanguage(
      language.projectId,
    );

    return segments.data.map((segment) => ({
      id: segment.id,
      text: segment.translationText,
      fromLanguage: originalLanguage.language.toString(),
      toLanguage: language.language.toString(),
    }));
  }
}

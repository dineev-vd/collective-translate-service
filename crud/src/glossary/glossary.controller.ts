import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GlossaryEntry } from 'entities/glossaryEntry.entity';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { GlossaryService } from './glossary.service';

@Controller('glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Get(':id/entries')
  async getEntries(@Param('id') glossaryId: string) {
    return this.glossaryService.getEntries(glossaryId);
  }
  @Post(':id/entries')
  async createEntry(
    @Param('id') glossaryId: string,
    @Body()
    entry: Pick<
      GlossaryEntry,
      'description' | 'phrase' | 'proposedTranslation'
    >,
  ) {
    return this.glossaryService.createEntry(glossaryId, entry);
  }

  @Get(':id/comments')
  async getComments(@Param('id') glossaryId: string) {
    return this.glossaryService.getComments(glossaryId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async postComment(
    @Param('id') glossaryId: string,
    @Req() { user }: ExtendedRequest,
    @Body() { text }: { text: string },
  ) {
    return this.glossaryService.postComment(glossaryId, {
      author: user,
      comment: text,
    });
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getTags(@Query('query') query: string) {
    return this.tagsService.getTagsByQuery(query);
  }
}

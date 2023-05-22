import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'guards/simple-guards.guard';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/')
  async getNews() {
    return this.newsService.getNews();
  }
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createNewsPost(
    @Body() content: { content: string; title: string },
    @Req() { user }: ExtendedRequest,
  ) {
    return this.newsService.createNewsPost({
      author: user,
      content: content.content,
      title: content.title,
    });
  }

  @Get(':id')
  async getNewsPost(@Param('id') postId: string) {
    return this.newsService.getNewsPost(postId);
  }
  @Get(':id/comments')
  async getComments(@Param('id') postId: string) {
    return this.newsService.getComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async postComment(
    @Param('id') postId: string,
    @Req() { user }: ExtendedRequest,
    @Body() { text }: { text: string },
  ) {
    return this.newsService.postComment(postId, {
      author: user,
      comment: text,
    });
  }
}

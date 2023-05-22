import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { NewsPost } from 'entities/newspost.entity';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  providers: [NewsService],
  imports: [TypeOrmModule.forFeature([NewsPost, Comment])],
  controllers: [NewsController],
  exports: [],
})
export class NewsModule {}

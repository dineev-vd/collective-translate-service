import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { NewsPost } from 'entities/newspost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsPost)
    private readonly newsRepository: Repository<NewsPost>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getNews() {
    return this.newsRepository.find();
  }

  async createNewsPost(
    newsPost: Pick<NewsPost, 'author' | 'content' | 'title'>,
  ) {
    return this.newsRepository.save(newsPost);
  }

  async getComments(newsPostId: string) {
    return (
      await this.newsRepository.findOne({
        where: { id: newsPostId },
        relations: { comments: true },
      })
    ).comments;
  }

  async getNewsPost(newsPostId: string) {
    return this.newsRepository.findOne({ where: { id: newsPostId } });
  }

  async postComment(
    newsPostId: string,
    comment: Pick<Comment, 'author' | 'comment'>,
  ) {
    return this.commentRepository.save({
      ...comment,
      newsPost: { id: newsPostId },
    });
  }
}

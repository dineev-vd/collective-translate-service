import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentService],
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}

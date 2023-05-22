import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'entities/comment.entity';
import { Glossary } from 'entities/glossary.entity';
import { GlossaryEntry } from 'entities/glossaryEntry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GlossaryService {
  constructor(
    @InjectRepository(Glossary)
    private readonly glossaryRepository: Repository<Glossary>,
    @InjectRepository(GlossaryEntry)
    private readonly glossaryEntryRepository: Repository<GlossaryEntry>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getEntries(glossaryId: string) {
    return (
      await this.glossaryRepository.findOne({
        where: { id: glossaryId },
        relations: { entries: true },
      })
    ).entries;
  }

  async createEntry(
    glossaryId: string,
    entry: Pick<
      GlossaryEntry,
      'description' | 'phrase' | 'proposedTranslation'
    >,
  ) {
    return this.glossaryEntryRepository.save({
      glossary: { id: glossaryId },
      ...entry,
    });
  }

  async getComments(glossaryId: string) {
    return (
      await this.glossaryRepository.findOne({
        where: { id: glossaryId },
        relations: { comments: true },
      })
    ).comments;
  }

  async postComment(
    glossaryId: string,
    comment: Pick<Comment, 'author' | 'comment'>,
  ) {
    return this.commentRepository.save({
      ...comment,
      glossary: { id: glossaryId },
    });
  }
}

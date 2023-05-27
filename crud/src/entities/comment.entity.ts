import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Glossary } from './glossary.entity';
import { NewsPost } from './newspost.entity';
import SegmentTranslation from './segment-translation.entity';
import { Suggestion } from './suggestion.entity';
import User from './user.entity';

@Entity()
export class Comment {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  comment: string;

  @ManyToOne(() => User, { cascade: true, eager: true })
  author: User;

  @ManyToOne(() => NewsPost, { nullable: true })
  newsPost?: NewsPost;

  @ManyToOne(() => Suggestion, { nullable: true })
  suggestion?: Suggestion;

  @ManyToOne(() => SegmentTranslation, { nullable: true })
  textSegment?: SegmentTranslation;

  @ManyToOne(() => Glossary, { nullable: true })
  glossary?: Glossary;

  @UpdateDateColumn()
  updatedDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ default: 0 })
  reportsCount: number;
}

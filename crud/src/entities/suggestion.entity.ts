import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Comment } from './comment.entity';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';

@Entity()
export class Suggestion {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  suggestion: string;

  @ManyToOne(() => User)
  author: User;

  @ManyToOne(() => SegmentTranslation, { cascade: ['update'] })
  segment: SegmentTranslation;

  @OneToMany(() => Comment, (comment) => comment.suggestion)
  comments: Comment[];

  @JoinTable({
    name: 'votes',
    joinColumn: {
      name: 'voter',
    },
    inverseJoinColumn: {
      name: 'suggestion',
    },
  })
  @ManyToMany(() => User, (user) => user.votedSuggestions)
  voters: User[];

  @RelationId((suggestion: Suggestion) => suggestion.voters)
  votersIds: string[];
}

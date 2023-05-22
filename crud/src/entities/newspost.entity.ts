import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import User from './user.entity';

@Entity()
export class NewsPost {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, { cascade: true, eager: true })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.newsPost)
  comments: Comment[];

  @UpdateDateColumn()
  updatedDate: Date;

  @CreateDateColumn()
  createdDate: Date;
}

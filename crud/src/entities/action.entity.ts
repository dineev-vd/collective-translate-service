import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import SegmentTranslation from './segment-translation.entity';
import User from './user.entity';

@Entity()
export class Action {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @ManyToOne(() => User)
  author: User;

  @Column()
  change: string;

  @ManyToOne(() => SegmentTranslation, {
    cascade: ['update'],
    onDelete: 'CASCADE',
  })
  segment: SegmentTranslation;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  timestamp: Date;
}

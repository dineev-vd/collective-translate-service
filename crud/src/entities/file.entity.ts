import { FileStatus } from 'common/enums';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import Project from './project.entity';
import SegmentTranslation from './segment-translation.entity';

@Entity()
export class File {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => SegmentTranslation, (textSegment) => textSegment.file, {
    cascade: ['insert'],
  })
  textSegments: SegmentTranslation[];

  @ManyToOne(() => Project)
  project: Project;

  @RelationId((file: File) => file.project)
  projectId: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  encoding: string;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.NEW,
  })
  status: FileStatus;
}

import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import SegmentTranslation from './segment-translation.entity';

export enum JobType {
  YANDEX,
  ARGOS,
}

@Entity()
export class JobResult {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @ManyToOne(() => SegmentTranslation)
  textSegment: SegmentTranslation;

  @Column({
    type: 'enum',
    enum: JobType,
  })
  status: JobType;

  @Column()
  text: string;
}

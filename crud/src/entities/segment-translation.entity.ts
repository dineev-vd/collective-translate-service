import { SegmentStatus } from 'common/enums';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Action } from './action.entity';
import { Comment } from './comment.entity';
import { File } from './file.entity';
import { JobResult } from './jobresult.entity';
import { Suggestion } from './suggestion.entity';
import { TranslationLanguage } from './translation-language.entity';
//
@Entity()
class SegmentTranslation {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column({ nullable: true })
  translationText?: string;

  @ManyToOne(
    () => TranslationLanguage,
    (language) => language.translationSegments,
  )
  translationLanguage: TranslationLanguage;

  @RelationId((segment: SegmentTranslation) => segment.translationLanguage)
  translationLanguageId: string;

  @ManyToOne(() => File, (file) => file.textSegments)
  file: File;

  @RelationId((segment: SegmentTranslation) => segment.file)
  fileId: string;

  @Column()
  order: number;

  @Column()
  shouldTranslate: boolean;

  @Column({
    type: 'enum',
    enum: SegmentStatus,
    default: SegmentStatus.NEW,
  })
  status: SegmentStatus;

  @OneToMany(() => Suggestion, (suggestion) => suggestion.segment)
  suggestions: Suggestion[];

  @RelationId((segment: SegmentTranslation) => segment.suggestions)
  suggestionsIds: string[];

  @OneToMany(() => Action, (action) => action.segment, { cascade: true })
  actions: Action[];

  @OneToMany(() => JobResult, (result) => result.textSegment, { cascade: true })
  jobResults: JobResult[];

  @RelationId((segment: SegmentTranslation) => segment.suggestions)
  jobResultsIds: string[];

  @OneToMany(() => Comment, (comment) => comment.textSegment)
  comments: Comment[];
}

export default SegmentTranslation;

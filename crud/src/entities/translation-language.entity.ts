import { Language } from 'common/enums';
import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { Assembly } from './assembly.entity';
import { Glossary } from './glossary.entity';
import Project from './project.entity';
import SegmentTranslation from './segment-translation.entity';

@Entity()
export class TranslationLanguage {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column({
    type: 'enum',
    enum: Language,
  })
  language: Language;

  @Column({ nullable: true })
  name: string;

  @OneToMany(
    () => SegmentTranslation,
    (segment) => segment.translationLanguage,
    { cascade: true },
  )
  translationSegments: SegmentTranslation[];

  @ManyToOne(() => Project, (p) => p.translateLanguage)
  project: Project;

  @RelationId((languge: TranslationLanguage) => languge.project)
  projectId: string;

  @OneToMany(() => Assembly, (assembly) => assembly.language)
  assemblies: Assembly[];

  @Column({ default: false })
  original: boolean;

  @OneToOne(() => Glossary, (g) => g.language, { cascade: true })
  glossary: Glossary;
}

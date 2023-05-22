import {
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { GlossaryEntry } from './glossaryEntry.entity';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
export class Glossary {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @OneToMany(() => GlossaryEntry, (entry) => entry.glossary)
  entries: GlossaryEntry[];

  @OneToMany(() => Comment, (comment) => comment.glossary)
  comments: Comment[];

  @OneToOne(() => TranslationLanguage, (l) => l.glossary, { eager: true })
  @JoinColumn()
  language: TranslationLanguage;

  @UpdateDateColumn()
  updatedDate: Date;

  @CreateDateColumn()
  createdDate: Date;
}

import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
export class Assembly {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  path: string;

  @Column()
  name: string;

  @ManyToOne(() => TranslationLanguage, { cascade: ['update'] })
  language: TranslationLanguage;
}

import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { Glossary } from './glossary.entity';

@Entity()
export class GlossaryEntry {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @ManyToOne(() => Glossary)
  glossary: Glossary;

  @Column()
  phrase: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  proposedTranslation?: string;
}

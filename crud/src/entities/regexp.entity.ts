import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class RegularExpression {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  name: string;

  @Column()
  regexp: string;
}

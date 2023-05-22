import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import { File } from './file.entity';
import { Order } from './order.entity';
import { ProjectTag } from './projecttag.enity';
import { TranslationLanguage } from './translation-language.entity';
import User from './user.entity';

@Entity()
export default class Project {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, { cascade: true })
  owner: User;

  @RelationId((project: Project) => project.owner)
  ownerId: string;

  @OneToMany(() => TranslationLanguage, (language) => language.project, {
    cascade: true,
  })
  translateLanguage: TranslationLanguage[];

  @Column({ default: '' })
  description: string;

  @OneToMany(() => File, (file) => file.project, { cascade: true })
  files: File[];

  @Column({ default: false })
  private: boolean;

  @ManyToMany(() => User, (user) => user.editableProjects, { cascade: true })
  @JoinTable({
    joinColumn: {
      name: 'editor',
    },
    inverseJoinColumn: {
      name: 'project',
    },
  })
  editors: User[];

  @RelationId((project: Project) => project.editors)
  editorsId: string[];

  @OneToOne(() => Order, (order) => order.project, { cascade: true })
  order: Order;

  @ManyToMany(() => ProjectTag, (tag) => tag.projects, {
    eager: true,
    cascade: true,
  })
  tags: ProjectTag[];
}

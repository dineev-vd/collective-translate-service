import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import Project from './project.entity';
import User from './user.entity';

@Entity()
export class Order {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  description: string;

  @OneToOne(() => Project, { cascade: ['soft-remove'], eager: true })
  @JoinColumn()
  project: Project;

  @RelationId((order: Order) => order.project)
  projectId: string;

  @ManyToMany(() => User, (user) => user.appliedOrders, { cascade: true })
  @JoinTable({
    joinColumn: {
      name: 'applicant',
    },
    inverseJoinColumn: {
      name: 'order',
    },
  })
  applicants: User[];
}

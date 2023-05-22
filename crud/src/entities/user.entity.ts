import { GetShortUserDto } from 'common/dto/user.dto';
import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Order } from './order.entity';
import Project from './project.entity';
import { Suggestion } from './suggestion.entity';

@Entity()
export default class User {
  @Generated()
  @PrimaryColumn({
    type: 'int',
    transformer: { from: (id) => id?.toString(), to: (id) => +id },
  })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  info: string;

  @Column({ default: '', select: false })
  refreshToken: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @ManyToMany(() => Project, (project) => project.editors)
  editableProjects: Project[];

  @ManyToMany(() => Order, (order) => order.applicants, {
    cascade: ['soft-remove', 'update'],
  })
  appliedOrders: Order;

  @ManyToMany(() => Suggestion, (suggestion) => suggestion.voters)
  votedSuggestions: Suggestion[];

  toGetShortUserDto(): GetShortUserDto {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

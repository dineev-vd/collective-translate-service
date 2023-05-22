import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import Project from './project.entity';

@Entity()
export class ProjectTag {
  @PrimaryColumn()
  id: string;

  @JoinTable({
    joinColumn: {
      name: 'project',
    },
    inverseJoinColumn: {
      name: 'tag',
    },
  })
  @ManyToMany(() => Project, (project) => project.tags)
  projects: Project[];
}

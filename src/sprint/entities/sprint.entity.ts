import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { ScrumTask } from '../../scrum-task/entities/scrum-task.entity';

@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn({ name: 'id_sprint' })
  id_sprint: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  objetivo?: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fecha_inicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'varchar', length: 30, default: 'planificado' })
  estado: string;

  @OneToMany(() => UserStory, (story) => story.sprint)
  stories: UserStory[];

  @OneToMany(() => ScrumTask, (task) => task.sprint)
  tasks: ScrumTask[];
}

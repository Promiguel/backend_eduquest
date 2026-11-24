import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { ScrumTask } from '../../scrum-task/entities/scrum-task.entity';

@Entity('historias_usuario')
export class UserStory {
  @PrimaryGeneratedColumn({ name: 'id_historia' })
  id_historia: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 30, default: 'media' })
  prioridad: string;

  @Column({ type: 'text', nullable: true })
  criterios_aceptacion?: string;

  @Column({ type: 'varchar', length: 30, default: 'pendiente' })
  estado: string;

  @ManyToOne(() => Sprint, (sprint) => sprint.stories, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_sprint' })
  sprint: Sprint;

  @OneToMany(() => ScrumTask, (task) => task.story)
  tasks: ScrumTask[];
}

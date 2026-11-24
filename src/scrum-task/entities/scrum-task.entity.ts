import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { User } from '../../user/entities/user.entity';

@Entity('tareas')
export class ScrumTask {
  @PrimaryGeneratedColumn({ name: 'id_tarea' })
  id_tarea: number;

  @Column({ type: 'varchar', length: 180 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 30, default: 'pendiente' })
  estado: string;

  @Column({ type: 'varchar', length: 30, default: 'media' })
  prioridad: string;

  @Column({
    name: 'estimacion_horas',
    type: 'decimal',
    precision: 7,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  estimacion_horas: number;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'datetime' })
  fecha_creacion: Date;

  @Column({ name: 'fecha_cierre', type: 'datetime', nullable: true })
  fecha_cierre?: Date | null;

  @ManyToOne(() => UserStory, (story) => story.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_historia' })
  story: UserStory;

  @ManyToOne(() => Sprint, (sprint) => sprint.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_sprint' })
  sprint: Sprint;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_responsable' })
  responsible?: User | null;
}

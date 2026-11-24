import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';

@Entity('horarios_curso')
export class CourseSchedule {
  @PrimaryGeneratedColumn({ name: 'id_horario' })
  id_horario: number;

  @Column({ type: 'varchar', length: 20 })
  dia_semana: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({ type: 'varchar', length: 100 })
  aula: string;

  @ManyToOne(() => Course, (course) => course.schedules, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_curso' })
  course: Course;
}

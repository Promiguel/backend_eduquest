import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Course } from '../../course/entities/course.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
import { ActivityAttempt } from '../../activity-attempt/entities/activity-attempt.entity';

@Entity('actividades_curso')
export class ActivityCourse {
  @PrimaryGeneratedColumn({ name: 'id_actividad_curso' })
  id_actividad_curso: number;

  @CreateDateColumn({ name: 'fecha_asignacion', type: 'datetime' })
  fecha_asignacion: Date;

  @Column({ name: 'fecha_apertura', type: 'datetime', nullable: true })
  fecha_apertura?: Date;

  @Column({ name: 'fecha_cierre', type: 'datetime', nullable: true })
  fecha_cierre?: Date;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  peso_evaluativo: number;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @ManyToOne(() => Activity, (activity) => activity.courseAssignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad' })
  activity: Activity;

  @ManyToOne(() => Course, (course) => course.activityAssignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_curso' })
  course: Course;

  @OneToMany(() => Evaluation, (evaluation) => evaluation.activityCourse)
  evaluations: Evaluation[];

  @OneToMany(() => ActivityAttempt, (attempt) => attempt.activityCourse)
  attempts: ActivityAttempt[];
}

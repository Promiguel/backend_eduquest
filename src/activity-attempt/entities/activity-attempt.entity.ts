import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { ActivityCourse } from '../../activity-course/entities/activity-course.entity';
import { AttemptResponse } from '../../attempt-response/entities/attempt-response.entity';

@Entity('intentos_actividad')
@Unique('uq_intento_inscripcion_actividad_numero', [
  'enrollment',
  'activityCourse',
  'numero_intento',
])
export class ActivityAttempt {
  @PrimaryGeneratedColumn({ name: 'id_intento' })
  id_intento: number;

  @Column({ name: 'numero_intento', type: 'int' })
  numero_intento: number;

  @CreateDateColumn({ name: 'fecha_inicio', type: 'datetime' })
  fecha_inicio: Date;

  @Column({ name: 'fecha_fin', type: 'datetime', nullable: true })
  fecha_fin?: Date;

  @Column({ name: 'tiempo_total_seg', type: 'int', nullable: true })
  tiempo_total_seg?: number;

  @Column({
    name: 'puntaje_total',
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  puntaje_total: number;

  @Column({ type: 'varchar', length: 30, default: 'en_progreso' })
  estado: string;

  @Column({ name: 'es_mejor_intento', type: 'boolean', default: false })
  es_mejor_intento: boolean;

  @ManyToOne(() => Enrollment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_inscripcion' })
  enrollment: Enrollment;

  @ManyToOne(
    () => ActivityCourse,
    (activityCourse) => activityCourse.attempts,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_actividad_curso' })
  activityCourse: ActivityCourse;

  @OneToMany(() => AttemptResponse, (response) => response.attempt)
  responses: AttemptResponse[];
}

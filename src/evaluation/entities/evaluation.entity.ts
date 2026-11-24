import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityCourse } from '../../activity-course/entities/activity-course.entity';
import { EvaluationCriterion } from '../../evaluation-criterion/entities/evaluation-criterion.entity';

@Entity('evaluaciones')
export class Evaluation {
  @PrimaryGeneratedColumn({ name: 'id_evaluacion' })
  id_evaluacion: number;

  @Column({
    name: 'nota_final',
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
  nota_final: number;

  @Column({
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
  porcentaje: number;

  @Column({ name: 'retroalimentacion_auto', type: 'text', nullable: true })
  retroalimentacion_auto?: string;

  @Column({ name: 'retroalimentacion_docente', type: 'text', nullable: true })
  retroalimentacion_docente?: string;

  @Column({ name: 'nota_modificada', type: 'boolean', default: false })
  nota_modificada: boolean;

  @UpdateDateColumn({ name: 'fecha_evaluacion', type: 'datetime' })
  fecha_evaluacion: Date;

  @ManyToOne(
    () => ActivityCourse,
    (activityCourse) => activityCourse.evaluations,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_actividad_curso' })
  activityCourse: ActivityCourse;

  @OneToMany(
    () => EvaluationCriterion,
    (evaluationCriterion) => evaluationCriterion.evaluation,
    { cascade: ['remove'] },
  )
  criteria: EvaluationCriterion[];
}

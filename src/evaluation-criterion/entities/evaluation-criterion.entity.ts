import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
import { RubricCriterion } from '../../rubric-criterion/entities/rubric-criterion.entity';

@Entity('evaluaciones_criterios')
export class EvaluationCriterion {
  @PrimaryColumn({ name: 'id_evaluacion', type: 'int' })
  id_evaluacion: number;

  @PrimaryColumn({ name: 'id_criterio', type: 'int' })
  id_criterio: number;

  @Column({
    name: 'puntaje_asignado',
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  puntaje_asignado: number;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.criteria, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id_evaluacion',
    referencedColumnName: 'id_evaluacion',
  })
  evaluation: Evaluation;

  @ManyToOne(
    () => RubricCriterion,
    (criterion) => criterion.evaluationCriteria,
    { nullable: false, onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'id_criterio', referencedColumnName: 'id_criterio' })
  criterion: RubricCriterion;
}

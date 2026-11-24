import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rubric } from '../../rubric/entities/rubric.entity';
import { EvaluationCriterion } from '../../evaluation-criterion/entities/evaluation-criterion.entity';

@Entity('criterios_rubrica')
export class RubricCriterion {
  @PrimaryGeneratedColumn({ name: 'id_criterio' })
  id_criterio: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

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
  peso: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  puntaje: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  maximo: number;

  @ManyToOne(() => Rubric, (rubric) => rubric.criteria, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rubrica' })
  rubric: Rubric;

  @OneToMany(
    () => EvaluationCriterion,
    (evaluationCriterion) => evaluationCriterion.criterion,
  )
  evaluationCriteria: EvaluationCriterion[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ActivityAttempt } from '../../activity-attempt/entities/activity-attempt.entity';
import { Problem } from '../../problem/entities/problem.entity';
import { AnswerOption } from '../../answer-option/entities/answer-option.entity';

@Entity('respuestas_intento')
@Unique('uq_respuesta_intento_problema', ['attempt', 'problem'])
export class AttemptResponse {
  @PrimaryGeneratedColumn({ name: 'id_respuesta' })
  id_respuesta: number;

  @Column({ name: 'respuesta_texto', type: 'text', nullable: true })
  respuesta_texto?: string;

  @Column({ name: 'es_correcta', type: 'boolean', default: false })
  es_correcta: boolean;

  @Column({
    name: 'puntaje_obtenido',
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
  puntaje_obtenido: number;

  @Column({ type: 'text', nullable: true })
  retroalimentacion?: string;

  @ManyToOne(() => ActivityAttempt, (attempt) => attempt.responses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_intento' })
  attempt: ActivityAttempt;

  @ManyToOne(() => Problem, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_problema' })
  problem: Problem;

  @ManyToOne(() => AnswerOption, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_opcion' })
  option?: AnswerOption | null;
}

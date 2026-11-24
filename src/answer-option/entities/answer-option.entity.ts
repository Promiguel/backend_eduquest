import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Problem } from '../../problem/entities/problem.entity';

@Entity('opciones_respuesta')
export class AnswerOption {
  @PrimaryGeneratedColumn({ name: 'id_opcion' })
  id_opcion: number;

  @Column({ type: 'text' })
  texto_opcion: string;

  @Column({ type: 'boolean', default: false })
  es_correcta: boolean;

  @Column({ type: 'int' })
  orden: number;

  @ManyToOne(() => Problem, (problem) => problem.options, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_problema' })
  problem: Problem;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { AnswerOption } from '../../answer-option/entities/answer-option.entity';

@Entity('problemas')
export class Problem {
  @PrimaryGeneratedColumn({ name: 'id_problema' })
  id_problema: number;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ type: 'text', nullable: true })
  contexto?: string;

  @Column({ name: 'nivel_dificultad', type: 'varchar', length: 50 })
  nivel_dificultad: string;

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

  @Column({ type: 'int' })
  orden: number;

  @Column({ type: 'text', nullable: true })
  retroalimentacion_auto?: string;

  @ManyToOne(() => Activity, (activity) => activity.problems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad' })
  activity: Activity;

  @OneToMany(() => AnswerOption, (option) => option.problem)
  options: AnswerOption[];
}

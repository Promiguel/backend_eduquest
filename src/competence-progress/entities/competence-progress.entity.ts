import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Competence } from '../../competence/entities/competence.entity';

@Entity('progreso_competencias')
@Unique('uq_progreso_estudiante_competencia', ['student', 'competence'])
export class CompetenceProgress {
  @PrimaryGeneratedColumn({ name: 'id_progreso' })
  id_progreso: number;

  @Column({ name: 'nivel_alcanzado', type: 'int' })
  nivel_alcanzado: number;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'datetime' })
  fecha_actualizacion: Date;

  @ManyToOne(() => Student, (student) => student.competenceProgress, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_estudiante' })
  student: Student;

  @ManyToOne(
    () => Competence,
    (competence) => competence.progress,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_competencia' })
  competence: Competence;
}

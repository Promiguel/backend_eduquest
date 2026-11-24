import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { ActivityCompetence } from '../../activity-competence/entities/activity-competence.entity';
import { CompetenceProgress } from '../../competence-progress/entities/competence-progress.entity';

@Entity('competencias')
export class Competence {
  @PrimaryGeneratedColumn({ name: 'id_competencia' })
  id_competencia: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nivel_esperado?: string;

  @ManyToMany(() => Subject, (subject) => subject.competences)
  @JoinTable({
    name: 'competencias_asignaturas',
    joinColumn: {
      name: 'id_competencia',
      referencedColumnName: 'id_competencia',
    },
    inverseJoinColumn: {
      name: 'id_asignatura',
      referencedColumnName: 'id_asignatura',
    },
  })
  subjects: Subject[];

  @OneToMany(
    () => ActivityCompetence,
    (activityCompetence) => activityCompetence.competence,
  )
  activityAssociations: ActivityCompetence[];

  @OneToMany(
    () => CompetenceProgress,
    (progress) => progress.competence,
  )
  progress: CompetenceProgress[];
}

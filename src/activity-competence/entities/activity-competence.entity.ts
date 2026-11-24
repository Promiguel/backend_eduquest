import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Competence } from '../../competence/entities/competence.entity';

@Entity('actividades_competencias')
export class ActivityCompetence {
  @PrimaryColumn({ name: 'id_actividad', type: 'int' })
  id_actividad: number;

  @PrimaryColumn({ name: 'id_competencia', type: 'int' })
  id_competencia: number;

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

  @ManyToOne(() => Activity, (activity) => activity.competences, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad', referencedColumnName: 'id_actividad' })
  activity: Activity;

  @ManyToOne(
    () => Competence,
    (competence) => competence.activityAssociations,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'id_competencia',
    referencedColumnName: 'id_competencia',
  })
  competence: Competence;
}

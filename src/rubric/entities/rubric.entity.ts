import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { RubricCriterion } from '../../rubric-criterion/entities/rubric-criterion.entity';

@Entity('rubricas')
export class Rubric {
  @PrimaryGeneratedColumn({ name: 'id_rubrica' })
  id_rubrica: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @OneToMany(() => Activity, (activity) => activity.rubric)
  activities: Activity[];

  @OneToMany(() => RubricCriterion, (criterion) => criterion.rubric)
  criteria: RubricCriterion[];
}

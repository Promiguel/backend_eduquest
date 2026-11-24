import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityLevel } from '../../activity-level/entities/activity-level.entity';
import { ActivityCourse } from '../../activity-course/entities/activity-course.entity';
import { Problem } from '../../problem/entities/problem.entity';
import { ActivityCompetence } from '../../activity-competence/entities/activity-competence.entity';
import { Rubric } from '../../rubric/entities/rubric.entity';

@Entity('actividades')
export class Activity {
  @PrimaryGeneratedColumn({ name: 'id_actividad' })
  id_actividad: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'varchar', length: 50 })
  dificultad: string;

  @Column({ type: 'int', nullable: true })
  tiempo_limite?: number;

  @Column({ type: 'int', nullable: true })
  intentos_maximos?: number;

  @Column({ type: 'text', nullable: true })
  objetivo_pedagogico?: string;

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
  puntaje_maximo: number;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'datetime' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'datetime' })
  fecha_modificacion: Date;

  @ManyToOne(() => Rubric, (rubric) => rubric.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_rubrica' })
  rubric?: Rubric | null;

  @ManyToMany(() => ActivityLevel, (level) => level.activities)
  @JoinTable({
    name: 'actividades_niveles',
    joinColumn: {
      name: 'id_actividad',
      referencedColumnName: 'id_actividad',
    },
    inverseJoinColumn: {
      name: 'id_nivel',
      referencedColumnName: 'id_nivel',
    },
  })
  levels: ActivityLevel[];

  @OneToMany(() => ActivityCourse, (activityCourse) => activityCourse.activity)
  courseAssignments: ActivityCourse[];

  @OneToMany(() => Problem, (problem) => problem.activity)
  problems: Problem[];

  @OneToMany(
    () => ActivityCompetence,
    (activityCompetence) => activityCompetence.activity,
  )
  competences: ActivityCompetence[];
}

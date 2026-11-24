import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ThematicUnit } from '../../thematic-unit/entities/thematic-unit.entity';
import { Course } from '../../course/entities/course.entity';
import { Competence } from '../../competence/entities/competence.entity';

@Entity('asignaturas')
export class Subject {
  @PrimaryGeneratedColumn({ name: 'id_asignatura' })
  id_asignatura: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  area?: string;

  @OneToMany(() => ThematicUnit, (unit) => unit.subject)
  thematicUnits: ThematicUnit[];

  @OneToMany(() => Course, (course) => course.subject)
  courses: Course[];

  @ManyToMany(() => Competence, (competence) => competence.subjects)
  competences: Competence[];
}

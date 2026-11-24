import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Institution } from '../../institution/entities/institution.entity';

@Entity('grados')
export class Grade {
  @PrimaryGeneratedColumn({ name: 'id_grado' })
  id_grado: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nivel_educativo?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nivel_esperado?: string;

  @ManyToOne(() => Institution, (institution) => institution.grades, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_institucion' })
  institution: Institution;

  @OneToMany(() => Course, (course) => course.grade)
  courses: Course[];
}

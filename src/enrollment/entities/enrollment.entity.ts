import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity';

@Entity('inscripciones')
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
  id_inscripcion: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @Column({
    name: 'nota_final_curso',
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  nota_final_curso?: number | null;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_estudiante' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_curso' })
  course: Course;
}

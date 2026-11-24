import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';

@Entity('reportes')
export class Report {
  @PrimaryGeneratedColumn({ name: 'id_reporte' })
  id_reporte: number;

  @Column({ name: 'tipo_reporte', type: 'varchar', length: 50 })
  tipo_reporte: string;

  @Column({ type: 'json', nullable: true })
  parametros?: Record<string, unknown>;

  @CreateDateColumn({ name: 'fecha_generacion', type: 'datetime' })
  fecha_generacion: Date;

  @Column({ name: 'fecha_archivo', type: 'datetime', nullable: true })
  fecha_archivo?: Date | null;

  @ManyToOne(() => Course, (course) => course.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_curso' })
  course?: Course | null;

  @ManyToOne(() => Student, (student) => student.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_estudiante' })
  student?: Student | null;

  @ManyToOne(() => Teacher, (teacher) => teacher.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_docente' })
  teacher?: Teacher | null;
}

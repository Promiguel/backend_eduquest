import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Badge } from '../../badge/entities/badge.entity';
import { Course } from '../../course/entities/course.entity';

@Entity('estudiantes_insignias')
@Unique('uq_estudiante_insignia_curso', ['student', 'badge', 'course'])
export class StudentBadge {
  @PrimaryGeneratedColumn({ name: 'id_estudiante_insignia' })
  id_estudiante_insignia: number;

  @CreateDateColumn({ name: 'fecha_obtencion', type: 'datetime' })
  fecha_obtencion: Date;

  @ManyToOne(() => Student, (student) => student.badges, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_estudiante' })
  student: Student;

  @ManyToOne(() => Badge, (badge) => badge.awards, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_insignia' })
  badge: Badge;

  @ManyToOne(() => Course, (course) => course.studentBadges, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_curso' })
  course?: Course | null;
}

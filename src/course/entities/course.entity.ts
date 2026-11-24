import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../../grade/entities/grade.entity';
import { Institution } from '../../institution/entities/institution.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { CourseSchedule } from '../../course-schedule/entities/course-schedule.entity';
import { ActivityCourse } from '../../activity-course/entities/activity-course.entity';
import { StudentBadge } from '../../student-badge/entities/student-badge.entity';
import { Report } from '../../report/entities/report.entity';

@Entity('cursos')
export class Course {
  @PrimaryGeneratedColumn({ name: 'id_curso' })
  id_curso: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  codigo_acceso?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  periodo_academico?: string;

  @Column({ type: 'int', nullable: true })
  cupo_maximo?: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio?: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin?: Date;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @ManyToOne(() => Institution, (institution) => institution.courses, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_institucion' })
  institution: Institution;

  @ManyToOne(() => Grade, (grade) => grade.courses, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_grado' })
  grade: Grade;

  @ManyToOne(() => Subject, (subject) => subject.courses, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_asignatura' })
  subject: Subject;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_docente' })
  teacher: Teacher;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => CourseSchedule, (schedule) => schedule.course)
  schedules: CourseSchedule[];

  @OneToMany(() => ActivityCourse, (activityCourse) => activityCourse.course)
  activityAssignments: ActivityCourse[];

  @OneToMany(() => StudentBadge, (studentBadge) => studentBadge.course)
  studentBadges: StudentBadge[];

  @OneToMany(() => Report, (report) => report.course)
  reports: Report[];
}

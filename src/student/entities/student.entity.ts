import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { GamificationProfile } from '../../gamification-profile/entities/gamification-profile.entity';
import { StudentBadge } from '../../student-badge/entities/student-badge.entity';
import { CompetenceProgress } from '../../competence-progress/entities/competence-progress.entity';
import { Report } from '../../report/entities/report.entity';

@Entity('estudiantes')
export class Student {
  @PrimaryGeneratedColumn({ name: 'id_estudiante' })
  id_estudiante: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo_estudiante?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  carrera?: string;

  @Column({ type: 'int', nullable: true })
  semestre?: number;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToOne(
    () => GamificationProfile,
    (profile) => profile.student,
  )
  gamificationProfile: GamificationProfile;

  @OneToMany(() => StudentBadge, (studentBadge) => studentBadge.student)
  badges: StudentBadge[];

  @OneToMany(
    () => CompetenceProgress,
    (progress) => progress.student,
  )
  competenceProgress: CompetenceProgress[];

  @OneToMany(() => Report, (report) => report.student)
  reports: Report[];
}

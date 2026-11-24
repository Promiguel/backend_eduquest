import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { Badge } from '../badge/entities/badge.entity';
import { CompetenceProgress } from '../competence-progress/entities/competence-progress.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { PointTransaction } from '../point-transaction/entities/point-transaction.entity';
import { Student } from '../student/entities/student.entity';
import { StudentBadgeController } from './student-badge.controller';
import { StudentBadgeService } from './student-badge.service';
import { StudentBadge } from './entities/student-badge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentBadge,
      Badge,
      Student,
      Course,
      Enrollment,
      GamificationProfile,
      PointTransaction,
      ActivityAttempt,
      CompetenceProgress,
    ]),
  ],
  controllers: [StudentBadgeController],
  providers: [StudentBadgeService],
  exports: [StudentBadgeService],
})
export class StudentBadgeModule {}

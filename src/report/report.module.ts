import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { CompetenceProgressModule } from '../competence-progress/competence-progress.module';
import { CompetenceProgress } from '../competence-progress/entities/competence-progress.entity';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { StudentBadge } from '../student-badge/entities/student-badge.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report } from './entities/report.entity';

@Module({
  imports: [
    CompetenceProgressModule,
    TypeOrmModule.forFeature([
      Report,
      Course,
      Student,
      Teacher,
      CompetenceProgress,
      ActivityAttempt,
      GamificationProfile,
      StudentBadge,
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}

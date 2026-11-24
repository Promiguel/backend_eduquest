import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { AttemptResponse } from '../attempt-response/entities/attempt-response.entity';
import { StudentBadgeModule } from '../student-badge/student-badge.module';
import { ActivityAttemptController } from './activity-attempt.controller';
import { ActivityAttemptService } from './activity-attempt.service';
import { ActivityAttempt } from './entities/activity-attempt.entity';

@Module({
  imports: [
    StudentBadgeModule,
    TypeOrmModule.forFeature([
      ActivityAttempt,
      Enrollment,
      ActivityCourse,
      Student,
      AttemptResponse,
    ]),
  ],
  controllers: [ActivityAttemptController],
  providers: [ActivityAttemptService],
  exports: [ActivityAttemptService],
})
export class ActivityAttemptModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence } from '../competence/entities/competence.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { StudentBadgeModule } from '../student-badge/student-badge.module';
import { Student } from '../student/entities/student.entity';
import { CompetenceProgressController } from './competence-progress.controller';
import { CompetenceProgressService } from './competence-progress.service';
import { CompetenceProgress } from './entities/competence-progress.entity';

@Module({
  imports: [
    StudentBadgeModule,
    TypeOrmModule.forFeature([
      CompetenceProgress,
      Student,
      Competence,
      Course,
      Enrollment,
    ]),
  ],
  controllers: [CompetenceProgressController],
  providers: [CompetenceProgressService],
  exports: [CompetenceProgressService],
})
export class CompetenceProgressModule {}

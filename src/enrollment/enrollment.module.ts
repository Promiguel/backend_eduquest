import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}

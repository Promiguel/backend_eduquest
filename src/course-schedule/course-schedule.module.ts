import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { CourseScheduleController } from './course-schedule.controller';
import { CourseScheduleService } from './course-schedule.service';
import { CourseSchedule } from './entities/course-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseSchedule, Course])],
  controllers: [CourseScheduleController],
  providers: [CourseScheduleService],
  exports: [CourseScheduleService],
})
export class CourseScheduleModule {}

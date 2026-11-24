import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { ActivityCourseController } from './activity-course.controller';
import { ActivityCourseService } from './activity-course.service';
import { ActivityCourse } from './entities/activity-course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityCourse, Activity, Course, Student]),
  ],
  controllers: [ActivityCourseController],
  providers: [ActivityCourseService],
  exports: [ActivityCourseService],
})
export class ActivityCourseModule {}

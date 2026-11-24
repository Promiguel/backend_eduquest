import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from '../grade/entities/grade.entity';
import { Institution } from '../institution/entities/institution.entity';
import { Subject } from '../subject/entities/subject.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Institution,
      Grade,
      Subject,
      Teacher,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}

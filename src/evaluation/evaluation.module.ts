import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from './entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, ActivityCourse, RubricCriterion]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}

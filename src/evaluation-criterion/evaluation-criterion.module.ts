import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { EvaluationCriterionController } from './evaluation-criterion.controller';
import { EvaluationCriterionService } from './evaluation-criterion.service';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';

@Module({
  imports: [
    EvaluationModule,
    TypeOrmModule.forFeature([
      EvaluationCriterion,
      Evaluation,
      RubricCriterion,
    ]),
  ],
  controllers: [EvaluationCriterionController],
  providers: [EvaluationCriterionService],
  exports: [EvaluationCriterionService],
})
export class EvaluationCriterionModule {}

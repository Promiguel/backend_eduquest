import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubric } from '../rubric/entities/rubric.entity';
import { RubricCriterionController } from './rubric-criterion.controller';
import { RubricCriterionService } from './rubric-criterion.service';
import { RubricCriterion } from './entities/rubric-criterion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RubricCriterion, Rubric])],
  controllers: [RubricCriterionController],
  providers: [RubricCriterionService],
  exports: [RubricCriterionService],
})
export class RubricCriterionModule {}

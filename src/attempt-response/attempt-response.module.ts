import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityAttemptModule } from '../activity-attempt/activity-attempt.module';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { AnswerOption } from '../answer-option/entities/answer-option.entity';
import { Problem } from '../problem/entities/problem.entity';
import { AttemptResponseController } from './attempt-response.controller';
import { AttemptResponseService } from './attempt-response.service';
import { AttemptResponse } from './entities/attempt-response.entity';

@Module({
  imports: [
    ActivityAttemptModule,
    TypeOrmModule.forFeature([
      AttemptResponse,
      ActivityAttempt,
      Problem,
      AnswerOption,
    ]),
  ],
  controllers: [AttemptResponseController],
  providers: [AttemptResponseService],
  exports: [AttemptResponseService],
})
export class AttemptResponseModule {}

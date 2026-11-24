import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from '../problem/entities/problem.entity';
import { AnswerOptionController } from './answer-option.controller';
import { AnswerOptionService } from './answer-option.service';
import { AnswerOption } from './entities/answer-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerOption, Problem])],
  controllers: [AnswerOptionController],
  providers: [AnswerOptionService],
  exports: [AnswerOptionService],
})
export class AnswerOptionModule {}

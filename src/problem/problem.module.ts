import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { Problem } from './entities/problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Activity])],
  controllers: [ProblemController],
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemModule {}

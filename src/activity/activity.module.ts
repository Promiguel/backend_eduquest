import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLevel } from '../activity-level/entities/activity-level.entity';
import { Problem } from '../problem/entities/problem.entity';
import { Rubric } from '../rubric/entities/rubric.entity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, ActivityLevel, Problem, Rubric]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}

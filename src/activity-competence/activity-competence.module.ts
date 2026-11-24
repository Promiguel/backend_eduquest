import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Competence } from '../competence/entities/competence.entity';
import { ActivityCompetenceController } from './activity-competence.controller';
import { ActivityCompetenceService } from './activity-competence.service';
import { ActivityCompetence } from './entities/activity-competence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityCompetence, Activity, Competence]),
  ],
  controllers: [ActivityCompetenceController],
  providers: [ActivityCompetenceService],
  exports: [ActivityCompetenceService],
})
export class ActivityCompetenceModule {}

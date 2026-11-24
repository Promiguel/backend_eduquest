import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenceController } from './competence.controller';
import { CompetenceService } from './competence.service';
import { Competence } from './entities/competence.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competence, Subject])],
  controllers: [CompetenceController],
  providers: [CompetenceService],
  exports: [CompetenceService],
})
export class CompetenceModule {}

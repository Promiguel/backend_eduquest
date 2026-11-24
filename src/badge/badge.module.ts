import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competence } from '../competence/entities/competence.entity';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { Badge } from './entities/badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Badge, Competence])],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule {}

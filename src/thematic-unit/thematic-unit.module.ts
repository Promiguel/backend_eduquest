import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from '../subject/entities/subject.entity';
import { ThematicUnitController } from './thematic-unit.controller';
import { ThematicUnitService } from './thematic-unit.service';
import { ThematicUnit } from './entities/thematic-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThematicUnit, Subject])],
  controllers: [ThematicUnitController],
  providers: [ThematicUnitService],
  exports: [ThematicUnitService],
})
export class ThematicUnitModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institution } from '../institution/entities/institution.entity';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';
import { Grade } from './entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, Institution])],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradeModule {}

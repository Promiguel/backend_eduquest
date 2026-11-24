import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricController } from './rubric.controller';
import { RubricService } from './rubric.service';
import { Rubric } from './entities/rubric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rubric])],
  controllers: [RubricController],
  providers: [RubricService],
  exports: [RubricService],
})
export class RubricModule {}

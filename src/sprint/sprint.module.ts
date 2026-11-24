import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { Sprint } from './entities/sprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, UserStory, ScrumTask])],
  controllers: [SprintController],
  providers: [SprintService],
  exports: [SprintService],
})
export class SprintModule {}

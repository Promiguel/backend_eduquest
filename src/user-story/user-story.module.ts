import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';
import { UserStory } from './entities/user-story.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStory, Sprint, ScrumTask])],
  controllers: [UserStoryController],
  providers: [UserStoryService],
  exports: [UserStoryService],
})
export class UserStoryModule {}

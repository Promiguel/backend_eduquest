import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { User } from '../user/entities/user.entity';
import { ScrumTaskController } from './scrum-task.controller';
import { ScrumTaskService } from './scrum-task.service';
import { ScrumTask } from './entities/scrum-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrumTask, Sprint, UserStory, User]),
  ],
  controllers: [ScrumTaskController],
  providers: [ScrumTaskService],
  exports: [ScrumTaskService],
})
export class ScrumTaskModule {}

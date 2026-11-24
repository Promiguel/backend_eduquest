import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserStory } from '../user-story/entities/user-story.entity';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { Sprint } from './entities/sprint.entity';
import { SprintService } from './sprint.service';

describe('SprintService', () => {
  const sprintRepository = { create: jest.fn(), save: jest.fn() };
  const storyRepository = {};
  const taskRepository = {};
  const service = new SprintService(
    sprintRepository as unknown as Repository<Sprint>,
    storyRepository as unknown as Repository<UserStory>,
    taskRepository as unknown as Repository<ScrumTask>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects a sprint whose end date is not after its start date', async () => {
    await expect(
      service.create({
        nombre: 'Sprint',
        fecha_inicio: '2026-04-10',
        fecha_fin: '2026-04-10',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(sprintRepository.save).not.toHaveBeenCalled();
  });
});

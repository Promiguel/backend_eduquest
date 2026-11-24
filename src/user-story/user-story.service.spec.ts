import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStory } from './entities/user-story.entity';
import { UserStoryService } from './user-story.service';

describe('UserStoryService', () => {
  const storyRepository = { create: jest.fn(), save: jest.fn() };
  const sprintRepository = { findOneBy: jest.fn() };
  const taskRepository = {};
  const service = new UserStoryService(
    storyRepository as unknown as Repository<UserStory>,
    sprintRepository as unknown as Repository<Sprint>,
    taskRepository as unknown as Repository<ScrumTask>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects creation when the referenced sprint does not exist', async () => {
    sprintRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        codigo: 'HU-1',
        descripcion: 'Permitir iniciar sesión',
        id_sprint: 5,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(storyRepository.save).not.toHaveBeenCalled();
  });
});

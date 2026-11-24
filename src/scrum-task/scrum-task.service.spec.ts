import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { ScrumTask } from './entities/scrum-task.entity';
import { ScrumTaskService } from './scrum-task.service';

describe('ScrumTaskService', () => {
  const taskRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const sprintRepository = { findOneBy: jest.fn() };
  const storyRepository = { findOne: jest.fn() };
  const userRepository = {};
  const service = new ScrumTaskService(
    taskRepository as unknown as Repository<ScrumTask>,
    sprintRepository as unknown as Repository<Sprint>,
    storyRepository as unknown as Repository<UserStory>,
    userRepository as unknown as Repository<User>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects a task whose sprint differs from its story sprint', async () => {
    sprintRepository.findOneBy.mockResolvedValue({ id_sprint: 9 });
    storyRepository.findOne.mockResolvedValue({
      id_historia: 3,
      sprint: { id_sprint: 8 },
    });

    await expect(
      service.create({
        titulo: 'Preparar criterios',
        id_historia: 3,
        id_sprint: 9,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('updates a task when its story sprint was not loaded with the task', async () => {
    const task = {
      id_tarea: 6,
      titulo: 'Old title',
      story: { id_historia: 3 },
      sprint: { id_sprint: 8 },
      responsible: null,
    };
    taskRepository.findOne.mockResolvedValue(task);
    storyRepository.findOne.mockResolvedValue({
      id_historia: 3,
      sprint: { id_sprint: 8 },
    });
    taskRepository.save.mockImplementation(async (value) => value);

    const result = await service.update(6, { titulo: 'New title' });

    expect(storyRepository.findOne).toHaveBeenCalledWith({
      where: { id_historia: 3 },
      relations: { sprint: true },
    });
    expect(result.titulo).toBe('New title');
    expect(taskRepository.save).toHaveBeenCalledWith(task);
  });

  it('updates a task when changing to a story in its own sprint', async () => {
    const task = {
      id_tarea: 6,
      story: { id_historia: 3 },
      sprint: { id_sprint: 9 },
      responsible: null,
    };
    const newStory = {
      id_historia: 4,
      sprint: { id_sprint: 9 },
    };
    taskRepository.findOne.mockResolvedValue(task);
    storyRepository.findOne.mockResolvedValue(newStory);
    taskRepository.save.mockImplementation(async (value) => value);

    const result = await service.update(6, { id_historia: 4 });

    expect(result.story).toBe(newStory);
    expect(result.sprint).toBe(newStory.sprint);
    expect(taskRepository.save).toHaveBeenCalledWith(task);
  });

  it('rejects changing a task to a sprint different from its story sprint', async () => {
    const task = {
      id_tarea: 6,
      story: { id_historia: 3 },
      sprint: { id_sprint: 8 },
      responsible: null,
    };
    taskRepository.findOne.mockResolvedValue(task);
    storyRepository.findOne.mockResolvedValue({
      id_historia: 3,
      sprint: { id_sprint: 8 },
    });
    sprintRepository.findOneBy.mockResolvedValue({ id_sprint: 9 });

    await expect(
      service.update(6, { id_sprint: 9 }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(taskRepository.save).not.toHaveBeenCalled();
  });

  it('returns not found when the requested story does not exist', async () => {
    const task = {
      id_tarea: 6,
      story: { id_historia: 3 },
      sprint: { id_sprint: 8 },
    };
    taskRepository.findOne.mockResolvedValue(task);
    storyRepository.findOne.mockResolvedValue(null);

    await expect(
      service.update(6, { id_historia: 99 }),
    ).rejects.toMatchObject({ status: 404 });
    expect(taskRepository.save).not.toHaveBeenCalled();
  });
});

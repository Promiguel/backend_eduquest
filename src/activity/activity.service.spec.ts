import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityLevel } from '../activity-level/entities/activity-level.entity';
import { Problem } from '../problem/entities/problem.entity';
import { Rubric } from '../rubric/entities/rubric.entity';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivityService', () => {
  const activityRepository = {
    create: jest.fn((activity) => activity),
    save: jest.fn(async (activity) => activity),
  };
  const levelQuery = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };
  const levelRepository = {
    createQueryBuilder: jest.fn(() => levelQuery),
  };
  const problemRepository = {};
  const rubricRepository = { findOneBy: jest.fn() };
  const service = new ActivityService(
    activityRepository as unknown as Repository<Activity>,
    levelRepository as unknown as Repository<ActivityLevel>,
    problemRepository as unknown as Repository<Problem>,
    rubricRepository as unknown as Repository<Rubric>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an activity with existing levels and rubric', async () => {
    const level = { id_nivel: 3 };
    const rubric = { id_rubrica: 4 };
    levelQuery.getMany.mockResolvedValue([level]);
    rubricRepository.findOneBy.mockResolvedValue(rubric);
    const dto: CreateActivityDto = {
      nombre: 'Caso clínico',
      tipo: 'problema',
      dificultad: 'media',
      puntaje_maximo: 10,
      id_niveles: [3],
      id_rubrica: 4,
    };

    await service.create(dto);

    expect(activityRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ levels: [level], rubric }),
    );
    expect(activityRepository.save).toHaveBeenCalled();
  });

  it('rejects duplicate level IDs instead of silently collapsing them', async () => {
    await expect(
      service.create({
        nombre: 'Actividad',
        tipo: 'problema',
        dificultad: 'media',
        puntaje_maximo: 10,
        id_niveles: [3, 3],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(activityRepository.save).not.toHaveBeenCalled();
  });

  it('rejects levels that do not exist', async () => {
    levelQuery.getMany.mockResolvedValue([]);

    await expect(
      service.create({
        nombre: 'Actividad',
        tipo: 'problema',
        dificultad: 'media',
        puntaje_maximo: 10,
        id_niveles: [99],
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

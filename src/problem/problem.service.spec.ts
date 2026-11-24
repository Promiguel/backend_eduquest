import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Problem } from './entities/problem.entity';
import { ProblemService } from './problem.service';

describe('ProblemService', () => {
  const problemRepository = {
    createQueryBuilder: jest.fn(),
    save: jest.fn(),
  };
  const activityRepository = { findOneBy: jest.fn() };
  const service = new ProblemService(
    problemRepository as unknown as Repository<Problem>,
    activityRepository as unknown as Repository<Activity>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents problem scores from exceeding the activity maximum', async () => {
    activityRepository.findOneBy.mockResolvedValue({
      id_actividad: 3,
      puntaje_maximo: 10,
    });
    const query = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '8.00' }),
    };
    problemRepository.createQueryBuilder.mockReturnValue(query);

    await expect(
      service.create({
        id_actividad: 3,
        enunciado: 'Pregunta',
        nivel_dificultad: 'media',
        puntaje: 3,
        orden: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(problemRepository.save).not.toHaveBeenCalled();
  });
});

import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Competence } from '../competence/entities/competence.entity';
import { ActivityCompetence } from './entities/activity-competence.entity';
import { ActivityCompetenceService } from './activity-competence.service';

describe('ActivityCompetenceService', () => {
  const associationRepository = { findOneBy: jest.fn(), save: jest.fn() };
  const activityRepository = { findOneBy: jest.fn() };
  const competenceRepository = { findOneBy: jest.fn() };
  const service = new ActivityCompetenceService(
    associationRepository as unknown as Repository<ActivityCompetence>,
    activityRepository as unknown as Repository<Activity>,
    competenceRepository as unknown as Repository<Competence>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an already existing activity-competence pair', async () => {
    associationRepository.findOneBy.mockResolvedValue({
      id_actividad: 1,
      id_competencia: 2,
    });

    await expect(
      service.create({ id_actividad: 1, id_competencia: 2, peso: 1 }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(associationRepository.save).not.toHaveBeenCalled();
    expect(activityRepository.findOneBy).not.toHaveBeenCalled();
  });
});

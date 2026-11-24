import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rubric } from '../rubric/entities/rubric.entity';
import { RubricCriterion } from './entities/rubric-criterion.entity';
import { RubricCriterionService } from './rubric-criterion.service';

describe('RubricCriterionService', () => {
  const usageQuery = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };
  const criterion = {
    id_criterio: 5,
    rubric: { id_rubrica: 2 },
  };
  const criterionRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => usageQuery),
    remove: jest.fn(),
  };
  const rubricRepository = {};
  const service = new RubricCriterionService(
    criterionRepository as unknown as Repository<RubricCriterion>,
    rubricRepository as unknown as Repository<Rubric>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents deleting a criterion already used in an evaluation', async () => {
    criterionRepository.findOne.mockResolvedValue(criterion);
    usageQuery.getCount.mockResolvedValue(1);

    await expect(service.remove(5)).rejects.toBeInstanceOf(ConflictException);
    expect(criterionRepository.remove).not.toHaveBeenCalled();
  });

  it('prevents moving an evaluated criterion to another rubric', async () => {
    criterionRepository.findOne.mockResolvedValue(criterion);
    usageQuery.getCount.mockResolvedValue(1);

    await expect(
      service.update(5, { id_rubrica: 9 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

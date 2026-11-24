import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rubric } from './entities/rubric.entity';
import { RubricService } from './rubric.service';

describe('RubricService', () => {
  const usageQuery = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };
  const rubric = { id_rubrica: 3 };
  const rubricRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => usageQuery),
    remove: jest.fn(),
  };
  const service = new RubricService(
    rubricRepository as unknown as Repository<Rubric>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents deleting a rubric whose criteria are already evaluated', async () => {
    rubricRepository.findOne.mockResolvedValue(rubric);
    usageQuery.getCount.mockResolvedValue(1);

    await expect(service.remove(3)).rejects.toBeInstanceOf(ConflictException);
    expect(rubricRepository.remove).not.toHaveBeenCalled();
  });
});

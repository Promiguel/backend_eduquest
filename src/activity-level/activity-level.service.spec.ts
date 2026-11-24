import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityLevel } from './entities/activity-level.entity';
import { ActivityLevelService } from './activity-level.service';

describe('ActivityLevelService', () => {
  const level = { id_nivel: 1 };
  const relationQuery = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };
  const levelRepository = {
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(() => relationQuery),
    remove: jest.fn(),
  };
  const service = new ActivityLevelService(
    levelRepository as unknown as Repository<ActivityLevel>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents deleting a level still attached to activities', async () => {
    levelRepository.findOneBy.mockResolvedValue(level);
    relationQuery.getCount.mockResolvedValue(1);

    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
    expect(levelRepository.remove).not.toHaveBeenCalled();
  });

  it('deletes an unused level', async () => {
    levelRepository.findOneBy.mockResolvedValue(level);
    relationQuery.getCount.mockResolvedValue(0);

    await service.remove(1);

    expect(levelRepository.remove).toHaveBeenCalledWith(level);
  });
});

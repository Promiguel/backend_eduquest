import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Badge } from '../badge/entities/badge.entity';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { Student } from '../student/entities/student.entity';
import { StudentBadge } from './entities/student-badge.entity';
import { StudentBadgeService } from './student-badge.service';

describe('StudentBadgeService', () => {
  const student = { id_estudiante: 2 };
  const badge = { id_insignia: 4 };
  const profile = { id_perfil: 8 };
  const existingAward = { id_estudiante_insignia: 11 };
  const studentRepository = { findOne: jest.fn() };
  const badgeRepository = { findOneBy: jest.fn() };
  const profileRepository = { findOne: jest.fn() };
  const awardRepository = { findOne: jest.fn() };
  const repositories = new Map<Function, object>([
    [Student, studentRepository],
    [Badge, badgeRepository],
    [GamificationProfile, profileRepository],
    [StudentBadge, awardRepository],
  ]);
  const manager = {
    getRepository: jest.fn((entity) => {
      const repository = repositories.get(entity);
      if (!repository) throw new Error('Unexpected repository');
      return repository;
    }),
  };
  const transactionManager = {
    transaction: jest.fn((callback) => callback(manager)),
  };
  const service = new StudentBadgeService(
    { manager: transactionManager } as unknown as Repository<StudentBadge>,
    {} as Repository<Badge>,
    {} as Repository<Student>,
    {} as Repository<Course>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    studentRepository.findOne.mockResolvedValue(student);
    badgeRepository.findOneBy.mockResolvedValue(badge);
    profileRepository.findOne.mockResolvedValue(profile);
    awardRepository.findOne.mockResolvedValue(existingAward);
  });

  it('rejects awarding the same badge to a student twice in the same context', async () => {
    await expect(
      service.award({ id_estudiante: 2, id_insignia: 4 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

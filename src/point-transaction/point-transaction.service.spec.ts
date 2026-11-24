import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { Student } from '../student/entities/student.entity';
import { PointTransaction } from './entities/point-transaction.entity';
import { PointTransactionService } from './point-transaction.service';

describe('PointTransactionService', () => {
  const student = { id_estudiante: 2 };
  const profile = { id_perfil: 9, puntos_totales: 10, nivel: 1, nivel_actual: 1 };
  const studentRepository = { findOne: jest.fn() };
  const profileRepository = { findOne: jest.fn(), save: jest.fn() };
  const transactionRepository = { create: jest.fn(), save: jest.fn() };
  const manager = {
    getRepository: jest.fn((entity) => {
      if (entity === Student) return studentRepository;
      if (entity === GamificationProfile) return profileRepository;
      if (entity === PointTransaction) return transactionRepository;
      throw new Error('Unexpected repository');
    }),
  };
  const transactionManager = {
    transaction: jest.fn((callback) => callback(manager)),
  };
  const service = new PointTransactionService(
    { manager: transactionManager } as unknown as Repository<PointTransaction>,
    {} as Repository<GamificationProfile>,
    {} as StudentBadgeService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    studentRepository.findOne.mockResolvedValue(student);
    profileRepository.findOne.mockResolvedValue(profile);
  });

  it('rejects a subtraction that would make the balance negative', async () => {
    await expect(
      service.create({
        id_estudiante: 2,
        tipo_transaccion: 'RESTA',
        monto: 11,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(profileRepository.save).not.toHaveBeenCalled();
    expect(transactionRepository.save).not.toHaveBeenCalled();
  });
});

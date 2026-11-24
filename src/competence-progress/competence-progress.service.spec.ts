import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Competence } from '../competence/entities/competence.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { Student } from '../student/entities/student.entity';
import { CompetenceProgress } from './entities/competence-progress.entity';
import { CompetenceProgressService } from './competence-progress.service';

describe('CompetenceProgressService', () => {
  const studentRepository = {
    findOne: jest.fn().mockResolvedValue({ id_estudiante: 2 }),
  };
  const competenceRepository = { findOneBy: jest.fn() };
  const progressRepository = { save: jest.fn() };
  const manager = {
    getRepository: jest.fn((entity) => {
      if (entity === Student) return studentRepository;
      if (entity === Competence) return competenceRepository;
      if (entity === CompetenceProgress) return progressRepository;
      throw new Error('Unexpected repository');
    }),
  };
  const transactionManager = {
    transaction: jest.fn((callback) => callback(manager)),
  };
  const service = new CompetenceProgressService(
    {
      manager: transactionManager,
    } as unknown as Repository<CompetenceProgress>,
    {} as Repository<Student>,
    {} as Repository<Competence>,
    {} as Repository<Course>,
    {} as Repository<Enrollment>,
    {} as StudentBadgeService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    studentRepository.findOne.mockResolvedValue({ id_estudiante: 2 });
    competenceRepository.findOneBy.mockResolvedValue(null);
  });

  it('rejects progress for a missing competence without saving', async () => {
    await expect(
      service.upsert({
        id_estudiante: 2,
        id_competencia: 6,
        nivel_alcanzado: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(progressRepository.save).not.toHaveBeenCalled();
  });
});

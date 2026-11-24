import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { CompetenceProgress } from '../competence-progress/entities/competence-progress.entity';
import { CompetenceProgressService } from '../competence-progress/competence-progress.service';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { StudentBadge } from '../student-badge/entities/student-badge.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Report } from './entities/report.entity';
import { ReportService } from './report.service';

describe('ReportService', () => {
  const report = { id_reporte: 1 };
  const reportRepository = {
    create: jest.fn().mockReturnValue(report),
    save: jest.fn().mockResolvedValue(report),
  };
  const courseRepository = { findOne: jest.fn() };
  const studentRepository = {};
  const teacherRepository = { findOneBy: jest.fn() };
  const progressRepository = {};
  const attemptRepository = {};
  const profileQuery = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };
  const awardQuery = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    distinct: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };
  const profileRepository = {
    createQueryBuilder: jest.fn(() => profileQuery),
  };
  const studentBadgeRepository = {
    createQueryBuilder: jest.fn(() => awardQuery),
  };
  const competenceProgressService = {};
  const service = new ReportService(
    reportRepository as unknown as Repository<Report>,
    courseRepository as unknown as Repository<Course>,
    studentRepository as unknown as Repository<Student>,
    teacherRepository as unknown as Repository<Teacher>,
    progressRepository as unknown as Repository<CompetenceProgress>,
    attemptRepository as unknown as Repository<ActivityAttempt>,
    profileRepository as unknown as Repository<GamificationProfile>,
    studentBadgeRepository as unknown as Repository<StudentBadge>,
    competenceProgressService as CompetenceProgressService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    profileQuery.getMany.mockResolvedValue([]);
    awardQuery.getMany.mockResolvedValue([]);
    reportRepository.create.mockReturnValue(report);
    reportRepository.save.mockResolvedValue(report);
  });

  it('rejects a report with a missing related course', async () => {
    courseRepository.findOne.mockResolvedValue(null);

    await expect(
      service.generate({
        tipo_reporte: 'GAMIFICACION',
        id_curso: 12,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(reportRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a course and teacher combination that does not match', async () => {
    courseRepository.findOne.mockResolvedValue({
      id_curso: 12,
      teacher: { id_docente: 3 },
    });
    teacherRepository.findOneBy.mockResolvedValue({ id_docente: 4 });

    await expect(
      service.generate({
        tipo_reporte: 'GAMIFICACION',
        id_curso: 12,
        id_docente: 4,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(reportRepository.save).not.toHaveBeenCalled();
  });

  it('applies the course scope to the ranking and its badge list', async () => {
    courseRepository.findOne.mockResolvedValue({
      id_curso: 12,
      teacher: { id_docente: 3 },
    });

    await service.generate({
      tipo_reporte: 'GAMIFICACION',
      id_curso: 12,
    });

    expect(profileQuery.andWhere).toHaveBeenCalledWith(
      'course.id_curso = :id_curso',
      { id_curso: 12 },
    );
    expect(awardQuery.andWhere).toHaveBeenCalledWith(
      'awardEnrollmentCourse.id_curso = :id_curso',
      { id_curso: 12 },
    );
    expect(awardQuery.getMany).toHaveBeenCalled();
  });
});

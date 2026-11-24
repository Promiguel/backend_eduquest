import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { Student } from '../student/entities/student.entity';
import { ActivityAttempt } from './entities/activity-attempt.entity';
import { ActivityAttemptService } from './activity-attempt.service';

describe('ActivityAttemptService', () => {
  const attemptRepository = { findOne: jest.fn() };
  const enrollmentRepository = {};
  const activityCourseRepository = {};
  const studentRepository = {};
  const studentBadgeService = {};
  const service = new ActivityAttemptService(
    attemptRepository as unknown as Repository<ActivityAttempt>,
    enrollmentRepository as unknown as Repository<Enrollment>,
    activityCourseRepository as unknown as Repository<ActivityCourse>,
    studentRepository as unknown as Repository<Student>,
    studentBadgeService as StudentBadgeService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a not-found error for an unknown attempt', async () => {
    attemptRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from './entities/gamification-profile.entity';
import { GamificationProfileService } from './gamification-profile.service';

describe('GamificationProfileService', () => {
  const profileRepository = {};
  const studentRepository = { findOneBy: jest.fn() };
  const courseRepository = {};
  const service = new GamificationProfileService(
    profileRepository as unknown as Repository<GamificationProfile>,
    studentRepository as unknown as Repository<Student>,
    courseRepository as unknown as Repository<Course>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not create a profile when the requested student does not exist', async () => {
    studentRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findByStudent(17)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

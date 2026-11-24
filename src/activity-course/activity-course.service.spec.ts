import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Activity } from '../activity/entities/activity.entity';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { ActivityCourse } from './entities/activity-course.entity';
import { ActivityCourseService } from './activity-course.service';

describe('ActivityCourseService', () => {
  const assignmentRepository = {
    create: jest.fn((assignment) => assignment),
    save: jest.fn(async (assignment) => assignment),
  };
  const activityRepository = { findOneBy: jest.fn() };
  const courseRepository = { findOneBy: jest.fn() };
  const studentRepository = { findOneBy: jest.fn() };
  const service = new ActivityCourseService(
    assignmentRepository as unknown as Repository<ActivityCourse>,
    activityRepository as unknown as Repository<Activity>,
    courseRepository as unknown as Repository<Course>,
    studentRepository as unknown as Repository<Student>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an assignment when its activity does not exist', async () => {
    activityRepository.findOneBy.mockResolvedValue(null);
    courseRepository.findOneBy.mockResolvedValue({ id_curso: 2 });

    await expect(
      service.create({
        id_actividad: 99,
        id_curso: 2,
        peso_evaluativo: 25,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(assignmentRepository.save).not.toHaveBeenCalled();
  });

  it('rejects an opening date after the closing date', async () => {
    await expect(
      service.create({
        id_actividad: 1,
        id_curso: 2,
        peso_evaluativo: 25,
        fecha_apertura: '2026-05-10T00:00:00Z',
        fecha_cierre: '2026-05-01T00:00:00Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(activityRepository.findOneBy).not.toHaveBeenCalled();
  });
});

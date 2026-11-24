import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { Evaluation } from './entities/evaluation.entity';
import { EvaluationService } from './evaluation.service';

describe('EvaluationService', () => {
  const evaluationRepository = { create: jest.fn(), save: jest.fn() };
  const activityCourseRepository = { findOneBy: jest.fn() };
  const rubricCriterionRepository = {};
  const service = new EvaluationService(
    evaluationRepository as unknown as Repository<Evaluation>,
    activityCourseRepository as unknown as Repository<ActivityCourse>,
    rubricCriterionRepository as unknown as Repository<RubricCriterion>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects evaluations for a missing activity-course assignment', async () => {
    activityCourseRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({ id_actividad_curso: 12 }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(evaluationRepository.save).not.toHaveBeenCalled();
  });
});

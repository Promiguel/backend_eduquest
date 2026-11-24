import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { EvaluationService } from '../evaluation/evaluation.service';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';
import { EvaluationCriterionService } from './evaluation-criterion.service';

describe('EvaluationCriterionService', () => {
  const evaluationCriterionRepository = { findOneBy: jest.fn(), save: jest.fn() };
  const evaluationRepository = {};
  const rubricCriterionRepository = {};
  const evaluationService = {};
  const service = new EvaluationCriterionService(
    evaluationCriterionRepository as unknown as Repository<EvaluationCriterion>,
    evaluationRepository as unknown as Repository<Evaluation>,
    rubricCriterionRepository as unknown as Repository<RubricCriterion>,
    evaluationService as EvaluationService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects duplicate evaluation-criterion pairs', async () => {
    evaluationCriterionRepository.findOneBy.mockResolvedValue({
      id_evaluacion: 1,
      id_criterio: 2,
    });

    await expect(
      service.create({
        id_evaluacion: 1,
        id_criterio: 2,
        puntaje_asignado: 4,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(evaluationCriterionRepository.save).not.toHaveBeenCalled();
  });
});

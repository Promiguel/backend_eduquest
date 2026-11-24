import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { ActivityAttemptService } from '../activity-attempt/activity-attempt.service';
import { AnswerOption } from '../answer-option/entities/answer-option.entity';
import { Problem } from '../problem/entities/problem.entity';
import { AttemptResponse } from './entities/attempt-response.entity';
import { AttemptResponseService } from './attempt-response.service';

describe('AttemptResponseService', () => {
  const responseRepository = {};
  const attemptRepository = { findOne: jest.fn() };
  const problemRepository = {};
  const optionRepository = {};
  const attemptService = {};
  const service = new AttemptResponseService(
    responseRepository as unknown as Repository<AttemptResponse>,
    attemptRepository as unknown as Repository<ActivityAttempt>,
    problemRepository as unknown as Repository<Problem>,
    optionRepository as unknown as Repository<AnswerOption>,
    attemptService as ActivityAttemptService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects responses for an unknown attempt', async () => {
    attemptRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create(99, { id_problema: 1, respuesta_texto: 'Respuesta' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

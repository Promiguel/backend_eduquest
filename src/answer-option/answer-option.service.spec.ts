import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Problem } from '../problem/entities/problem.entity';
import { AnswerOption } from './entities/answer-option.entity';
import { AnswerOptionService } from './answer-option.service';

describe('AnswerOptionService', () => {
  const optionRepository = { create: jest.fn(), save: jest.fn() };
  const problemRepository = { findOneBy: jest.fn() };
  const service = new AnswerOptionService(
    optionRepository as unknown as Repository<AnswerOption>,
    problemRepository as unknown as Repository<Problem>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects options whose problem does not exist', async () => {
    problemRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        id_problema: 91,
        texto_opcion: 'Respuesta',
        orden: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(optionRepository.save).not.toHaveBeenCalled();
  });
});

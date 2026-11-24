import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Competence } from '../competence/entities/competence.entity';
import { Badge } from './entities/badge.entity';
import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  const badgeRepository = { create: jest.fn(), save: jest.fn() };
  const competenceRepository = { findOneBy: jest.fn() };
  const service = new BadgeService(
    badgeRepository as unknown as Repository<Badge>,
    competenceRepository as unknown as Repository<Competence>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects a competence-level criterion for a missing competence', async () => {
    competenceRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        nombre: 'Competencia',
        tipo: 'COMPETENCIA',
        criterio_obtencion: {
          tipo: 'COMPETENCIA_NIVEL',
          nivel: 2,
          id_competencia: 6,
        },
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(badgeRepository.save).not.toHaveBeenCalled();
  });
});

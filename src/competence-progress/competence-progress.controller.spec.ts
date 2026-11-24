import { CompetenceProgressController } from './competence-progress.controller';
import { CompetenceProgressService } from './competence-progress.service';

describe('CompetenceProgressController', () => {
  it('delegates progress creation to the upsert operation', () => {
    const dto = {
      id_estudiante: 2,
      id_competencia: 6,
      nivel_alcanzado: 3,
    };
    const response = Promise.resolve({ id_progreso: 9 });
    const upsert = jest.fn().mockReturnValue(response);
    const controller = new CompetenceProgressController({
      upsert,
    } as unknown as CompetenceProgressService);

    expect(controller.create(dto)).toBe(response);
    expect(upsert).toHaveBeenCalledWith(dto);
  });
});

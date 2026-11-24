import { CreateRubricDto } from './dto/create-rubric.dto';
import { RubricController } from './rubric.controller';
import { RubricService } from './rubric.service';

describe('RubricController', () => {
  it('delegates rubric creation to the service', () => {
    const response = Promise.resolve({ id_rubrica: 1 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new RubricController({
      create,
    } as unknown as RubricService);
    const dto = { nombre: 'Analítica', tipo: 'ABP' } as CreateRubricDto;

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

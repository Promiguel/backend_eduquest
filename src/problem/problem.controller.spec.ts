import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';

describe('ProblemController', () => {
  it('forwards problem creation to the service', () => {
    const response = Promise.resolve({ id_problema: 4 });
    const create = jest.fn().mockReturnValue(response);
    const service = {
      create,
    } as unknown as ProblemService;
    const controller = new ProblemController(service);
    const dto = {
      id_actividad: 3,
      enunciado: 'Pregunta',
      nivel_dificultad: 'media',
      puntaje: 2,
      orden: 1,
    } as CreateProblemDto;

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

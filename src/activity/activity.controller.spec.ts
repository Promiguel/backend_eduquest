import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivityController', () => {
  it('forwards activity creation to the service', () => {
    const response = Promise.resolve({ id_actividad: 1 });
    const create = jest.fn().mockReturnValue(response);
    const service = {
      create,
    } as unknown as ActivityService;
    const controller = new ActivityController(service);
    const dto = {
      nombre: 'Caso',
      tipo: 'problema',
      dificultad: 'media',
      puntaje_maximo: 10,
    } as CreateActivityDto;

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

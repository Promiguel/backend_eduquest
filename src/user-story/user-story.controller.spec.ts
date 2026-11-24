import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

describe('UserStoryController', () => {
  it('delegates user-story creation to the service', () => {
    const dto = {
      codigo: 'HU-1',
      descripcion: 'Permitir iniciar sesión',
      id_sprint: 5,
    };
    const response = Promise.resolve({ id_historia: 2 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new UserStoryController({
      create,
    } as unknown as UserStoryService);

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

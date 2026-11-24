import { ScrumTaskController } from './scrum-task.controller';
import { ScrumTaskService } from './scrum-task.service';

describe('ScrumTaskController', () => {
  it('delegates task creation to the service', () => {
    const dto = {
      titulo: 'Preparar criterios',
      id_historia: 3,
      id_sprint: 9,
    };
    const response = Promise.resolve({ id_tarea: 6 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new ScrumTaskController({
      create,
    } as unknown as ScrumTaskService);

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';

describe('SprintController', () => {
  it('delegates sprint creation to the service', () => {
    const dto = {
      nombre: 'Iteración 1',
      fecha_inicio: '2026-04-10',
      fecha_fin: '2026-04-24',
    };
    const response = Promise.resolve({ id_sprint: 1 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new SprintController({
      create,
    } as unknown as SprintService);

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

import { AttemptResponseController } from './attempt-response.controller';
import { AttemptResponseService } from './attempt-response.service';

describe('AttemptResponseController', () => {
  it('delegates response submission to the service', () => {
    const response = Promise.resolve({ id_respuesta: 3 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new AttemptResponseController({
      create,
    } as unknown as AttemptResponseService);
    const dto = { id_problema: 2, id_opcion: 5 };

    expect(controller.create(4, dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(4, dto);
  });
});

import { AnswerOptionController } from './answer-option.controller';
import { AnswerOptionService } from './answer-option.service';

describe('AnswerOptionController', () => {
  it('forwards option lookups to the service', () => {
    const response = Promise.resolve({ id_opcion: 6 });
    const findOne = jest.fn().mockReturnValue(response);
    const service = {
      findOne,
    } as unknown as AnswerOptionService;
    const controller = new AnswerOptionController(service);

    expect(controller.findOne(6)).toBe(response);
    expect(findOne).toHaveBeenCalledWith(6);
  });
});

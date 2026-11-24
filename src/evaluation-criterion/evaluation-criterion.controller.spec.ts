import { EvaluationCriterionController } from './evaluation-criterion.controller';
import { EvaluationCriterionService } from './evaluation-criterion.service';

describe('EvaluationCriterionController', () => {
  it('delegates composite-key lookups', () => {
    const response = Promise.resolve({ id_evaluacion: 1, id_criterio: 2 });
    const findOne = jest.fn().mockReturnValue(response);
    const controller = new EvaluationCriterionController({
      findOne,
    } as unknown as EvaluationCriterionService);

    expect(controller.findOne(1, 2)).toBe(response);
    expect(findOne).toHaveBeenCalledWith(1, 2);
  });
});

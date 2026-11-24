import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

describe('EvaluationController', () => {
  it('delegates recalculation to the evaluation service', () => {
    const response = Promise.resolve({ id_evaluacion: 7 });
    const recalculate = jest.fn().mockReturnValue(response);
    const controller = new EvaluationController({
      recalculate,
    } as unknown as EvaluationService);

    expect(controller.recalculate(7)).toBe(response);
    expect(recalculate).toHaveBeenCalledWith(7);
  });
});

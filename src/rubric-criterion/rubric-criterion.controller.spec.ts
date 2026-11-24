import { RubricCriterionController } from './rubric-criterion.controller';
import { RubricCriterionService } from './rubric-criterion.service';

describe('RubricCriterionController', () => {
  it('delegates criterion lookups to the service', () => {
    const response = Promise.resolve({ id_criterio: 5 });
    const findOne = jest.fn().mockReturnValue(response);
    const controller = new RubricCriterionController({
      findOne,
    } as unknown as RubricCriterionService);

    expect(controller.findOne(5)).toBe(response);
    expect(findOne).toHaveBeenCalledWith(5);
  });
});

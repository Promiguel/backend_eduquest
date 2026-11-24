import { ActivityLevelController } from './activity-level.controller';
import { ActivityLevelService } from './activity-level.service';

describe('ActivityLevelController', () => {
  it('delegates level lookups to the service', () => {
    const response = Promise.resolve({ id_nivel: 8 });
    const findOne = jest.fn().mockReturnValue(response);
    const service = {
      findOne,
    } as unknown as ActivityLevelService;
    const controller = new ActivityLevelController(service);

    expect(controller.findOne(8)).toBe(response);
    expect(findOne).toHaveBeenCalledWith(8);
  });
});

import { ActivityAttemptController } from './activity-attempt.controller';
import { ActivityAttemptService } from './activity-attempt.service';

describe('ActivityAttemptController', () => {
  it('delegates attempt completion to the service', () => {
    const response = Promise.resolve({ id_intento: 4 });
    const finish = jest.fn().mockReturnValue(response);
    const controller = new ActivityAttemptController({
      finish,
    } as unknown as ActivityAttemptService);

    expect(controller.finish(4)).toBe(response);
    expect(finish).toHaveBeenCalledWith(4);
  });
});

import { ActivityCompetenceController } from './activity-competence.controller';
import { ActivityCompetenceService } from './activity-competence.service';

describe('ActivityCompetenceController', () => {
  it('forwards composite-key lookups', () => {
    const response = Promise.resolve({ id_actividad: 1, id_competencia: 2 });
    const findOne = jest.fn().mockReturnValue(response);
    const service = {
      findOne,
    } as unknown as ActivityCompetenceService;
    const controller = new ActivityCompetenceController(service);

    expect(controller.findOne(1, 2)).toBe(response);
    expect(findOne).toHaveBeenCalledWith(1, 2);
  });
});

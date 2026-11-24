import { GamificationProfileController } from './gamification-profile.controller';
import { GamificationProfileService } from './gamification-profile.service';

describe('GamificationProfileController', () => {
  it('delegates profile lookups by student', () => {
    const response = Promise.resolve({ id_perfil: 8 });
    const findByStudent = jest.fn().mockReturnValue(response);
    const controller = new GamificationProfileController({
      findByStudent,
    } as unknown as GamificationProfileService);

    expect(controller.findByStudent(17)).toBe(response);
    expect(findByStudent).toHaveBeenCalledWith(17);
  });
});

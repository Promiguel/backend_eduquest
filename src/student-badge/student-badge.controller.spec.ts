import { StudentBadgeController } from './student-badge.controller';
import { StudentBadgeService } from './student-badge.service';

describe('StudentBadgeController', () => {
  it('delegates badge assignment', () => {
    const dto = { id_estudiante: 2, id_insignia: 4 };
    const response = Promise.resolve({ id_estudiante_insignia: 7 });
    const award = jest.fn().mockReturnValue(response);
    const controller = new StudentBadgeController({
      award,
    } as unknown as StudentBadgeService);

    expect(controller.award(dto)).toBe(response);
    expect(award).toHaveBeenCalledWith(dto);
  });
});

import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';

describe('BadgeController', () => {
  it('delegates badge creation', () => {
    const dto = {
      nombre: 'Pionero',
      tipo: 'PUNTOS',
      criterio_obtencion: { tipo: 'PUNTOS_ACUMULADOS' as const, cantidad: 50 },
    };
    const response = Promise.resolve({ id_insignia: 3 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new BadgeController({
      create,
    } as unknown as BadgeService);

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

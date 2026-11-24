import { PointTransactionController } from './point-transaction.controller';
import { PointTransactionService } from './point-transaction.service';

describe('PointTransactionController', () => {
  it('delegates transaction creation', () => {
    const dto = {
      id_estudiante: 2,
      tipo_transaccion: 'SUMA' as const,
      monto: 25,
    };
    const response = Promise.resolve({ id_transaccion: 4 });
    const create = jest.fn().mockReturnValue(response);
    const controller = new PointTransactionController({
      create,
    } as unknown as PointTransactionService);

    expect(controller.create(dto)).toBe(response);
    expect(create).toHaveBeenCalledWith(dto);
  });
});

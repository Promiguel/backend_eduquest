import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
  it('delegates report generation to the service', () => {
    const dto = { tipo_reporte: 'PROGRESO' as const };
    const response = Promise.resolve({ reporte: { id_reporte: 1 }, datos: [] });
    const generate = jest.fn().mockReturnValue(response);
    const controller = new ReportController({
      generate,
    } as unknown as ReportService);

    expect(controller.generate(dto)).toBe(response);
    expect(generate).toHaveBeenCalledWith(dto);
  });
});

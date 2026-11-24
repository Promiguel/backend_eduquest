import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsIn(['PROGRESO', 'DESEMPENO_ACADEMICO', 'GAMIFICACION'])
  tipo_reporte: 'PROGRESO' | 'DESEMPENO_ACADEMICO' | 'GAMIFICACION';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_curso?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_estudiante?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_docente?: number;

  @IsObject()
  @IsOptional()
  parametros?: Record<string, unknown>;
}

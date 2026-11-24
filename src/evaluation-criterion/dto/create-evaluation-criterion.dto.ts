import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEvaluationCriterionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_evaluacion: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_criterio: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  puntaje_asignado: number;

  @IsString()
  @IsOptional()
  observacion?: string;
}

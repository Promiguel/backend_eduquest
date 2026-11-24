import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateEvaluationCriterionDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  puntaje_asignado?: number;

  @IsString()
  @IsOptional()
  observacion?: string;
}

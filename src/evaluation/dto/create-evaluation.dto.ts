import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEvaluationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_actividad_curso: number;

  @IsString()
  @IsOptional()
  retroalimentacion_auto?: string;
}

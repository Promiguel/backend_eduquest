import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateEvaluationDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  nota_final?: number;

  @IsString()
  @IsOptional()
  retroalimentacion_auto?: string;

  @IsString()
  @IsOptional()
  retroalimentacion_docente?: string;
}

import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsDateString()
  fecha_inicio: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  nota_final_curso?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_estudiante: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_curso: number;
}

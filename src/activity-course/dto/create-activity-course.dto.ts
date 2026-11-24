import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateActivityCourseDto {
  @IsDateString()
  @IsOptional()
  fecha_apertura?: string;

  @IsDateString()
  @IsOptional()
  fecha_cierre?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  peso_evaluativo: number;

  @IsString()
  @IsOptional()
  estado?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_actividad: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_curso: number;
}

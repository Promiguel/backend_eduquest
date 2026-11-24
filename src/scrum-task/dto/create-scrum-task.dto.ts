import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateScrumTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  estado?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  prioridad?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999.99)
  @IsOptional()
  estimacion_horas?: number;

  @IsDateString()
  @IsOptional()
  fecha_cierre?: string | null;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_historia: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_sprint: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_responsable?: number | null;
}

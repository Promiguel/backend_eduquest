import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  codigo_acceso?: string;

  @IsString()
  @IsOptional()
  periodo_academico?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  cupo_maximo?: number;

  @IsDateString()
  @IsOptional()
  fecha_inicio?: string;

  @IsDateString()
  @IsOptional()
  fecha_fin?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_institucion: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_grado: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_asignatura: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_docente: number;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ArrayUnique,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  dificultad: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  tiempo_limite?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  intentos_maximos?: number;

  @IsString()
  @IsOptional()
  objetivo_pedagogico?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  puntaje_maximo: number;

  @IsString()
  @IsOptional()
  estado?: string;

  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @ArrayUnique({ message: 'No se permiten niveles duplicados' })
  @IsOptional()
  id_niveles?: number[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_rubrica?: number | null;
}

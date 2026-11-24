import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProblemDto {
  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @IsString()
  @IsOptional()
  contexto?: string;

  @IsString()
  @IsNotEmpty()
  nivel_dificultad: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  puntaje: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden: number;

  @IsString()
  @IsOptional()
  retroalimentacion_auto?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_actividad: number;
}

import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateActivityLevelDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  numero_nivel: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  puntaje_nivel: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden: number;
}

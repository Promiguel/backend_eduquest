import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import type { BadgeCriterion } from '../entities/badge.entity';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUrl()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsObject()
  criterio_obtencion: BadgeCriterion;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  puntos_asociados = 0;
}

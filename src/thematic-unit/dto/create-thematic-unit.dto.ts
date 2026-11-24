import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateThematicUnitDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_asignatura: number;
}

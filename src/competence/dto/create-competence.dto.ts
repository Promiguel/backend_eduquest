import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCompetenceDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  nivel_esperado?: string;

  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @IsOptional()
  id_asignaturas?: number[];
}

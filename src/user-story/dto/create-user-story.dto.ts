import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserStoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  prioridad?: string;

  @IsString()
  @IsOptional()
  criterios_aceptacion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  estado?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_sprint: number;
}

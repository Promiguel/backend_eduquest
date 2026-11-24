import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAnswerOptionDto {
  @IsString()
  @IsNotEmpty()
  texto_opcion: string;

  @IsBoolean()
  @IsOptional()
  es_correcta?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  orden: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_problema: number;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAttemptResponseDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_problema: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_opcion?: number;

  @IsString()
  @IsOptional()
  respuesta_texto?: string;
}

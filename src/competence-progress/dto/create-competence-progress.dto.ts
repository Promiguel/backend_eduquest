import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateCompetenceProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_estudiante: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_competencia: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  nivel_alcanzado: number;
}

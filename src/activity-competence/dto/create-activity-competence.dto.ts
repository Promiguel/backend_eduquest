import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateActivityCompetenceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_actividad: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_competencia: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  peso: number;
}

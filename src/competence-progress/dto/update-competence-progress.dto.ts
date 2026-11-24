import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateCompetenceProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  nivel_alcanzado: number;
}

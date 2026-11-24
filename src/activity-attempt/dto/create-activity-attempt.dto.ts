import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateActivityAttemptDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_inscripcion: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_actividad_curso: number;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AwardStudentBadgeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_estudiante: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_insignia: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_curso?: number;
}

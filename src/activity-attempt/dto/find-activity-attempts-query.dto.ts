import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindActivityAttemptsQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_inscripcion?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_actividad_curso?: number;
}

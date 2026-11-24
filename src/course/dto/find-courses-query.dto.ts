import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindCoursesQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_institucion?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_grado?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_asignatura?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_docente?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_estudiante?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}

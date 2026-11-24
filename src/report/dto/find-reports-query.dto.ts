import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindReportsQueryDto extends PaginationQueryDto {
  @IsIn(['PROGRESO', 'DESEMPENO_ACADEMICO', 'GAMIFICACION'])
  @IsOptional()
  tipo_reporte?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_curso?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_estudiante?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_docente?: number;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindCompetencesQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  tipo?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_asignatura?: number;
}

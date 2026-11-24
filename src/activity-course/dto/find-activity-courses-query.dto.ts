import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindActivityCoursesQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_actividad?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_curso?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindActivitiesQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  dificultad?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindPointTransactionsQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_estudiante?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_perfil?: number;
}

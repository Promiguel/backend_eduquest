import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindRubricsQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  tipo?: string;
}

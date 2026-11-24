import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindSprintsQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  estado?: string;
}

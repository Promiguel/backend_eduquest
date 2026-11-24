import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindScrumTasksQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_responsable?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_sprint?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  id_historia?: number;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  estado?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  prioridad?: string;
}

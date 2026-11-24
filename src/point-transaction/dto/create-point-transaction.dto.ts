import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePointTransactionDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_estudiante: number;

  @IsIn(['SUMA', 'RESTA'])
  tipo_transaccion: 'SUMA' | 'RESTA';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  monto: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  descripcion?: string;
}

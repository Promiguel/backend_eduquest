import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRubricDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;
}

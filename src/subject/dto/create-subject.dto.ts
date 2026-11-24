import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  area?: string;
}

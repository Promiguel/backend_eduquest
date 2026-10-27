import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  id_usuario: number;

  @IsString({ message: 'El código del docente debe ser texto' })
  @IsOptional()
  codigo_docente?: string;

  @IsString({ message: 'La especialidad debe ser texto' })
  @IsOptional()
  especialidad?: string;

  @IsString({ message: 'El título debe ser texto' })
  @IsOptional()
  titulo?: string;

  @IsString({ message: 'El estado debe ser texto' })
  @IsOptional()
  estado?: string;
}

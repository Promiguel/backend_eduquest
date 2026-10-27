import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  id_usuario: number;

  @IsString({ message: 'El código del estudiante debe ser texto' })
  @IsOptional()
  codigo_estudiante?: string;

  @IsString({ message: 'La carrera debe ser texto' })
  @IsOptional()
  carrera?: string;

  @IsInt({ message: 'El semestre debe ser un número entero' })
  @Min(1, { message: 'El semestre debe ser mayor o igual a 1' })
  @Max(20, { message: 'El semestre no puede superar 20' })
  @IsOptional()
  semestre?: number;

  @IsString({ message: 'El estado debe ser texto' })
  @IsOptional()
  estado?: string;
}

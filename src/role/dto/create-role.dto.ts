import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'El nombre del rol debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
  nombre: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  descripcion?: string;
}

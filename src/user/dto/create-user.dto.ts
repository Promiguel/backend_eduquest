import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(['estudiante', 'docente', 'administrador'], {
    message: 'El rol debe ser estudiante, docente o administrador',
  })
  rol?: string;
}

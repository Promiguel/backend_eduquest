import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

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

  @Type(() => Number)
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe asignar al menos un rol' })
  @ArrayUnique({ message: 'No se permiten roles duplicados' })
  @IsInt({ each: true, message: 'Cada rol debe ser un ID entero' })
  @Min(1, { each: true, message: 'Cada ID de rol debe ser positivo' })
  roleIds: number[];
}

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateInstitutionDto {
  @IsString({ message: 'El nombre de la institución debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la institución es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsString({ message: 'La dirección debe ser un texto' })
  @IsOptional()
  direccion?: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsOptional()
  telefono?: string;

  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsOptional()
  correo?: string;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsOptional()
  estado?: string;
}

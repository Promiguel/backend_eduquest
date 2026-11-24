import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

export class CreateCourseScheduleDto {
  @IsString()
  @Matches(/^(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)$/i, {
    message: 'dia_semana debe ser un día válido de la semana',
  })
  dia_semana: string;

  @IsString()
  @Matches(timePattern, {
    message: 'hora_inicio debe tener formato HH:mm o HH:mm:ss',
  })
  hora_inicio: string;

  @IsString()
  @Matches(timePattern, {
    message: 'hora_fin debe tener formato HH:mm o HH:mm:ss',
  })
  hora_fin: string;

  @IsString()
  @IsNotEmpty()
  aula: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  id_curso: number;
}

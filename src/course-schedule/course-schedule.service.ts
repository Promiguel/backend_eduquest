import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { createPageResult } from '../common/pagination/page-result';
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { FindCourseSchedulesQueryDto } from './dto/find-course-schedules-query.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import { CourseSchedule } from './entities/course-schedule.entity';

@Injectable()
export class CourseScheduleService {
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly scheduleRepository: Repository<CourseSchedule>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(dto: CreateCourseScheduleDto): Promise<CourseSchedule> {
    this.validateScheduleTimes(dto.hora_inicio, dto.hora_fin);
    const course = await this.findCourse(dto.id_curso);
    const { id_curso: _id_curso, ...scheduleData } = dto;
    return this.scheduleRepository.save(
      this.scheduleRepository.create({ ...scheduleData, course }),
    );
  }

  async findAll(query: FindCourseSchedulesQueryDto) {
    const where: FindOptionsWhere<CourseSchedule> = {};
    if (query.id_curso !== undefined) {
      where.course = { id_curso: query.id_curso };
    }
    if (query.dia_semana !== undefined) {
      where.dia_semana = query.dia_semana;
    }

    const [data, total] = await this.scheduleRepository.findAndCount({
      where,
      relations: { course: true },
      order: { id_horario: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_horario: number): Promise<CourseSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id_horario },
      relations: { course: true },
    });
    if (!schedule) {
      throw new NotFoundException(
        `Horario de curso con ID ${id_horario} no encontrado`,
      );
    }
    return schedule;
  }

  async update(
    id_horario: number,
    dto: UpdateCourseScheduleDto,
  ): Promise<CourseSchedule> {
    const schedule = await this.findOne(id_horario);
    this.validateScheduleTimes(
      dto.hora_inicio ?? schedule.hora_inicio,
      dto.hora_fin ?? schedule.hora_fin,
    );
    const { id_curso, ...scheduleData } = dto;
    if (id_curso !== undefined) {
      schedule.course = await this.findCourse(id_curso);
    }
    Object.assign(schedule, scheduleData);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id_horario: number): Promise<void> {
    const schedule = await this.findOne(id_horario);
    await this.scheduleRepository.remove(schedule);
  }

  private async findCourse(id_curso: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id_curso });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    return course;
  }

  private validateScheduleTimes(hora_inicio: string, hora_fin: string): void {
    const toSeconds = (time: string): number => {
      const [hours, minutes, seconds = '0'] = time.split(':');
      return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    };
    if (toSeconds(hora_fin) <= toSeconds(hora_inicio)) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la hora de inicio',
      );
    }
  }
}

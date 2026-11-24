import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Activity } from '../activity/entities/activity.entity';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { ActivityCourse } from './entities/activity-course.entity';
import { CreateActivityCourseDto } from './dto/create-activity-course.dto';
import { FindActivityCoursesQueryDto } from './dto/find-activity-courses-query.dto';
import { UpdateActivityCourseDto } from './dto/update-activity-course.dto';

@Injectable()
export class ActivityCourseService {
  constructor(
    @InjectRepository(ActivityCourse)
    private readonly assignmentRepository: Repository<ActivityCourse>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(dto: CreateActivityCourseDto): Promise<ActivityCourse> {
    this.validateDates(dto.fecha_apertura, dto.fecha_cierre);
    const [activity, course] = await Promise.all([
      this.findActivity(dto.id_actividad),
      this.findCourse(dto.id_curso),
    ]);
    const { id_actividad: _id_actividad, id_curso: _id_curso, ...data } = dto;
    return this.assignmentRepository.save(
      this.assignmentRepository.create({ ...data, activity, course }),
    );
  }

  async findAll(query: FindActivityCoursesQueryDto) {
    const where: FindOptionsWhere<ActivityCourse> = {};
    if (query.id_actividad !== undefined) {
      where.activity = { id_actividad: query.id_actividad };
    }
    if (query.id_curso !== undefined) {
      where.course = { id_curso: query.id_curso };
    }
    if (query.estado !== undefined) {
      where.estado = query.estado;
    }
    const [data, total] = await this.assignmentRepository.findAndCount({
      where,
      relations: { activity: true, course: true },
      order: { id_actividad_curso: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_actividad_curso: number): Promise<ActivityCourse> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id_actividad_curso },
      relations: { activity: true, course: true },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Asignación de actividad con ID ${id_actividad_curso} no encontrada`,
      );
    }
    return assignment;
  }

  async findByCourse(id_curso: number, query: FindActivityCoursesQueryDto) {
    await this.findCourse(id_curso);
    return this.findAll({
      page: query.page,
      limit: query.limit,
      id_actividad: query.id_actividad,
      id_curso,
      estado: query.estado,
    });
  }

  async findAvailableForStudent(
    id_estudiante: number,
    query: FindActivityCoursesQueryDto,
  ) {
    const student = await this.studentRepository.findOneBy({ id_estudiante });
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .innerJoin('assignment.course', 'course')
      .innerJoin('course.enrollments', 'enrollment')
      .innerJoin('enrollment.student', 'student')
      .leftJoinAndSelect('assignment.activity', 'activity')
      .leftJoinAndSelect('assignment.course', 'assignedCourse')
      .where('student.id_estudiante = :id_estudiante', { id_estudiante })
      .andWhere('enrollment.estado = :enrollmentState', {
        enrollmentState: 'activo',
      })
      .andWhere('assignment.estado = :assignmentState', {
        assignmentState: 'activo',
      })
      .andWhere(
        '(assignment.fecha_apertura IS NULL OR assignment.fecha_apertura <= CURRENT_TIMESTAMP)',
      )
      .andWhere(
        '(assignment.fecha_cierre IS NULL OR assignment.fecha_cierre >= CURRENT_TIMESTAMP)',
      )
      .orderBy('assignment.fecha_asignacion', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return createPageResult(data, total, query.page, query.limit);
  }

  async update(
    id_actividad_curso: number,
    dto: UpdateActivityCourseDto,
  ): Promise<ActivityCourse> {
    const assignment = await this.findOne(id_actividad_curso);
    this.validateDates(
      dto.fecha_apertura ?? assignment.fecha_apertura,
      dto.fecha_cierre ?? assignment.fecha_cierre,
    );
    const { id_actividad, id_curso, ...data } = dto;
    if (id_actividad !== undefined) {
      assignment.activity = await this.findActivity(id_actividad);
    }
    if (id_curso !== undefined) {
      assignment.course = await this.findCourse(id_curso);
    }
    Object.assign(assignment, data);
    return this.assignmentRepository.save(assignment);
  }

  async remove(id_actividad_curso: number): Promise<void> {
    const assignment = await this.findOne(id_actividad_curso);
    await this.assignmentRepository.remove(assignment);
  }

  private validateDates(
    fecha_apertura?: string | Date,
    fecha_cierre?: string | Date,
  ): void {
    if (
      fecha_apertura !== undefined &&
      fecha_cierre !== undefined &&
      new Date(fecha_apertura).getTime() > new Date(fecha_cierre).getTime()
    ) {
      throw new BadRequestException(
        'La fecha de apertura no puede ser posterior a la fecha de cierre',
      );
    }
  }

  private async findActivity(id_actividad: number): Promise<Activity> {
    const activity = await this.activityRepository.findOneBy({ id_actividad });
    if (!activity) {
      throw new NotFoundException(
        `Actividad con ID ${id_actividad} no encontrada`,
      );
    }
    return activity;
  }

  private async findCourse(id_curso: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id_curso });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    return course;
  }
}

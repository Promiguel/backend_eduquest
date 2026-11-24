import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { AttemptResponse } from '../attempt-response/entities/attempt-response.entity';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { ActivityAttempt } from './entities/activity-attempt.entity';
import { CreateActivityAttemptDto } from './dto/create-activity-attempt.dto';
import { FindActivityAttemptsQueryDto } from './dto/find-activity-attempts-query.dto';

@Injectable()
export class ActivityAttemptService {
  constructor(
    @InjectRepository(ActivityAttempt)
    private readonly attemptRepository: Repository<ActivityAttempt>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(ActivityCourse)
    private readonly activityCourseRepository: Repository<ActivityCourse>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly studentBadgeService: StudentBadgeService,
  ) {}

  async create(dto: CreateActivityAttemptDto): Promise<ActivityAttempt> {
    return this.attemptRepository.manager.transaction(async (manager) => {
      const enrollmentRepository = manager.getRepository(Enrollment);
      const enrollmentLock = await enrollmentRepository.findOne({
        where: { id_inscripcion: dto.id_inscripcion },
        lock: { mode: 'pessimistic_write' },
      });
      if (!enrollmentLock) {
        throw new NotFoundException(
          `Inscripción con ID ${dto.id_inscripcion} no encontrada`,
        );
      }
      const enrollment = await enrollmentRepository.findOne({
        where: { id_inscripcion: dto.id_inscripcion },
        relations: { course: true },
      });
      if (!enrollment) {
        throw new NotFoundException(
          `Inscripción con ID ${dto.id_inscripcion} no encontrada`,
        );
      }
      const activityCourse = await manager
        .getRepository(ActivityCourse)
        .findOne({
          where: { id_actividad_curso: dto.id_actividad_curso },
          relations: { activity: true, course: true },
        });
      if (!activityCourse) {
        throw new NotFoundException(
          `Actividad de curso con ID ${dto.id_actividad_curso} no encontrada`,
        );
      }
      if (enrollment.estado !== 'activo') {
        throw new BadRequestException(
          'La inscripción del estudiante no está activa',
        );
      }
      if (enrollment.course.id_curso !== activityCourse.course.id_curso) {
        throw new BadRequestException(
          'La inscripción no corresponde al curso de la actividad',
        );
      }
      this.validateAssignmentAvailability(activityCourse);

      const attempts = manager.getRepository(ActivityAttempt);
      const count = await attempts.count({
        where: {
          enrollment: { id_inscripcion: dto.id_inscripcion },
          activityCourse: { id_actividad_curso: dto.id_actividad_curso },
        },
      });
      if (
        activityCourse.activity.intentos_maximos &&
        count >= activityCourse.activity.intentos_maximos
      ) {
        throw new BadRequestException(
          'El estudiante alcanzó el máximo de intentos permitidos para esta actividad',
        );
      }
      return attempts.save(
        attempts.create({
          enrollment,
          activityCourse,
          numero_intento: count + 1,
          puntaje_total: 0,
          estado: 'en_progreso',
          es_mejor_intento: false,
        }),
      );
    });
  }

  async findAll(query: FindActivityAttemptsQueryDto) {
    const [data, total] = await this.attemptRepository.findAndCount({
      where: {
        ...(query.id_inscripcion === undefined
          ? {}
          : { enrollment: { id_inscripcion: query.id_inscripcion } }),
        ...(query.id_actividad_curso === undefined
          ? {}
          : {
              activityCourse: {
                id_actividad_curso: query.id_actividad_curso,
              },
            }),
      },
      relations: {
        enrollment: { student: true },
        activityCourse: { activity: true, course: true },
      },
      order: { id_intento: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_intento: number): Promise<ActivityAttempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { id_intento },
      relations: {
        enrollment: { student: true, course: true },
        activityCourse: { activity: true, course: true },
        responses: { problem: true, option: true },
      },
    });
    if (!attempt) {
      throw new NotFoundException(`Intento con ID ${id_intento} no encontrado`);
    }
    return attempt;
  }

  async findHistoryForEnrollment(
    id_inscripcion: number,
    query: FindActivityAttemptsQueryDto,
  ) {
    await this.findEnrollment(id_inscripcion);
    return this.findAll({
      page: query.page,
      limit: query.limit,
      id_inscripcion,
      id_actividad_curso: query.id_actividad_curso,
    });
  }

  async findResultsForStudent(
    id_estudiante: number,
    query: FindActivityAttemptsQueryDto,
  ) {
    const student = await this.studentRepository.findOneBy({ id_estudiante });
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    const queryBuilder = this.attemptRepository
      .createQueryBuilder('attempt')
      .innerJoinAndSelect('attempt.enrollment', 'enrollment')
      .innerJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'enrolledCourse')
      .leftJoinAndSelect('attempt.activityCourse', 'activityCourse')
      .leftJoinAndSelect('activityCourse.activity', 'activity')
      .leftJoinAndSelect('activityCourse.course', 'course')
      .where('student.id_estudiante = :id_estudiante', { id_estudiante })
      .orderBy('attempt.fecha_inicio', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return createPageResult(data, total, query.page, query.limit);
  }

  async findResultsForActivityCourse(
    id_actividad_curso: number,
    query: FindActivityAttemptsQueryDto,
  ) {
    await this.findActivityCourse(id_actividad_curso);
    return this.findAll({
      page: query.page,
      limit: query.limit,
      id_inscripcion: query.id_inscripcion,
      id_actividad_curso,
    });
  }

  async findByEnrollmentAndActivityCourse(
    id_inscripcion: number,
    id_actividad_curso: number,
  ): Promise<ActivityAttempt | null> {
    return this.attemptRepository.findOne({
      where: {
        enrollment: { id_inscripcion },
        activityCourse: { id_actividad_curso },
      },
    });
  }

  async finish(id_intento: number): Promise<ActivityAttempt> {
    return this.attemptRepository.manager.transaction(async (manager) => {
      const attempts = manager.getRepository(ActivityAttempt);
      const responses = manager.getRepository(AttemptResponse);
      const attempt = await attempts.findOne({
        where: { id_intento },
        relations: {
          enrollment: { student: true },
          activityCourse: { course: true },
        },
      });
      if (!attempt) {
        throw new NotFoundException(
          `Intento con ID ${id_intento} no encontrado`,
        );
      }
      if (attempt.estado !== 'en_progreso') {
        throw new BadRequestException('El intento ya fue finalizado');
      }
      const result = await responses
        .createQueryBuilder('response')
        .select('COALESCE(SUM(response.puntaje_obtenido), 0)', 'total')
        .where('response.attempt = :id_intento', { id_intento })
        .getRawOne<{ total: string | number }>();
      const now = new Date();
      attempt.puntaje_total = Number(result?.total ?? 0);
      attempt.fecha_fin = now;
      attempt.tiempo_total_seg = Math.max(
        0,
        Math.floor((now.getTime() - attempt.fecha_inicio.getTime()) / 1000),
      );
      attempt.estado = 'completado';
      await attempts.save(attempt);

      const siblings = await attempts.find({
        where: {
          enrollment: { id_inscripcion: attempt.enrollment.id_inscripcion },
          activityCourse: {
            id_actividad_curso: attempt.activityCourse.id_actividad_curso,
          },
          estado: 'completado',
        },
        order: { puntaje_total: 'DESC', fecha_inicio: 'ASC' },
      });
      siblings.forEach((sibling, index) => {
        sibling.es_mejor_intento = index === 0;
      });
      await attempts.save(siblings);
      await this.studentBadgeService.evaluateEligible(
        manager,
        attempt.enrollment.student.id_estudiante,
        attempt.activityCourse.course.id_curso,
      );
      const finishedAttempt = await attempts.findOne({
        where: { id_intento },
        relations: {
          enrollment: { student: true },
          activityCourse: { activity: true, course: true },
        },
      });
      if (!finishedAttempt) {
        throw new NotFoundException(
          `Intento con ID ${id_intento} no encontrado`,
        );
      }
      return finishedAttempt;
    });
  }

  async recalculateScore(id_intento: number): Promise<number> {
    const attempt = await this.findOne(id_intento);
    if (attempt.estado !== 'en_progreso') {
      throw new BadRequestException(
        'No se pueden modificar respuestas de un intento finalizado',
      );
    }
    const result = await this.attemptRepository.manager
      .getRepository(AttemptResponse)
      .createQueryBuilder('response')
      .select('COALESCE(SUM(response.puntaje_obtenido), 0)', 'total')
      .where('response.attempt = :id_intento', { id_intento })
      .getRawOne<{ total: string | number }>();
    attempt.puntaje_total = Number(result?.total ?? 0);
    await this.attemptRepository.save(attempt);
    return attempt.puntaje_total;
  }

  private validateAssignmentAvailability(activityCourse: ActivityCourse): void {
    const now = Date.now();
    if (
      activityCourse.estado !== 'activo' ||
      (activityCourse.fecha_apertura &&
        activityCourse.fecha_apertura.getTime() > now) ||
      (activityCourse.fecha_cierre &&
        activityCourse.fecha_cierre.getTime() < now)
    ) {
      throw new BadRequestException(
        'La actividad no está disponible en este momento',
      );
    }
  }

  private async findEnrollment(id_inscripcion: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id_inscripcion },
      relations: { course: true },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Inscripción con ID ${id_inscripcion} no encontrada`,
      );
    }
    return enrollment;
  }

  private async findActivityCourse(
    id_actividad_curso: number,
  ): Promise<ActivityCourse> {
    const activityCourse = await this.activityCourseRepository.findOne({
      where: { id_actividad_curso },
      relations: { activity: true, course: true },
    });
    if (!activityCourse) {
      throw new NotFoundException(
        `Actividad de curso con ID ${id_actividad_curso} no encontrada`,
      );
    }
    return activityCourse;
  }
}

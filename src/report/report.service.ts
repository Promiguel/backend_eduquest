import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { CompetenceProgress } from '../competence-progress/entities/competence-progress.entity';
import { CompetenceProgressService } from '../competence-progress/competence-progress.service';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { StudentBadge } from '../student-badge/entities/student-badge.entity';
import { Student } from '../student/entities/student.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { FindReportsQueryDto } from './dto/find-reports-query.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(CompetenceProgress)
    private readonly progressRepository: Repository<CompetenceProgress>,
    @InjectRepository(ActivityAttempt)
    private readonly attemptRepository: Repository<ActivityAttempt>,
    @InjectRepository(GamificationProfile)
    private readonly profileRepository: Repository<GamificationProfile>,
    @InjectRepository(StudentBadge)
    private readonly studentBadgeRepository: Repository<StudentBadge>,
    private readonly competenceProgressService: CompetenceProgressService,
  ) {}

  async generate(dto: CreateReportDto) {
    const [course, student, teacher] = await Promise.all([
      dto.id_curso === undefined
        ? null
        : this.courseRepository.findOne({
            where: { id_curso: dto.id_curso },
            relations: { teacher: true },
          }),
      dto.id_estudiante === undefined
        ? null
        : this.studentRepository.findOneBy({
            id_estudiante: dto.id_estudiante,
          }),
      dto.id_docente === undefined
        ? null
        : this.teacherRepository.findOneBy({ id_docente: dto.id_docente }),
    ]);
    if (dto.id_curso !== undefined && !course) {
      throw new NotFoundException(`Curso con ID ${dto.id_curso} no encontrado`);
    }
    if (dto.id_estudiante !== undefined && !student) {
      throw new NotFoundException(
        `Estudiante con ID ${dto.id_estudiante} no encontrado`,
      );
    }
    if (dto.id_docente !== undefined && !teacher) {
      throw new NotFoundException(
        `Docente con ID ${dto.id_docente} no encontrado`,
      );
    }
    if (
      course &&
      teacher &&
      course.teacher.id_docente !== teacher.id_docente
    ) {
      throw new BadRequestException(
        'El curso no pertenece al docente indicado',
      );
    }

    const data = await this.generateData(dto);
    const report = await this.reportRepository.save(
      this.reportRepository.create({
        tipo_reporte: dto.tipo_reporte,
        parametros: dto.parametros,
        course,
        student,
        teacher,
      }),
    );
    return { reporte: report, datos: data };
  }

  async findAll(query: FindReportsQueryDto) {
    const [data, total] = await this.reportRepository.findAndCount({
      where: {
        ...(query.tipo_reporte === undefined
          ? {}
          : { tipo_reporte: query.tipo_reporte }),
        ...(query.id_curso === undefined
          ? {}
          : { course: { id_curso: query.id_curso } }),
        ...(query.id_estudiante === undefined
          ? {}
          : { student: { id_estudiante: query.id_estudiante } }),
        ...(query.id_docente === undefined
          ? {}
          : { teacher: { id_docente: query.id_docente } }),
      },
      relations: { course: true, student: true, teacher: true },
      order: { fecha_generacion: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id_reporte: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id_reporte },
      relations: { course: true, student: true, teacher: true },
    });
    if (!report) {
      throw new NotFoundException(
        `Reporte con ID ${id_reporte} no encontrado`,
      );
    }
    return report;
  }

  async archive(id_reporte: number): Promise<Report> {
    const report = await this.findOne(id_reporte);
    report.fecha_archivo = new Date();
    return this.reportRepository.save(report);
  }

  async remove(id_reporte: number): Promise<void> {
    const report = await this.findOne(id_reporte);
    await this.reportRepository.remove(report);
  }

  private async generateData(dto: CreateReportDto): Promise<unknown> {
    if (dto.tipo_reporte === 'PROGRESO') {
      if (dto.id_estudiante !== undefined) {
        return this.competenceProgressService.findStudentCompetencies(
          dto.id_estudiante,
          dto.id_curso,
        );
      }
      if (dto.id_curso !== undefined) {
        return this.competenceProgressService.findForCourse(dto.id_curso);
      }
      return this.progressRepository.find({
        relations: { student: true, competence: true },
        order: { fecha_actualizacion: 'DESC' },
      });
    }

    if (dto.tipo_reporte === 'DESEMPENO_ACADEMICO') {
      const query = this.attemptRepository
        .createQueryBuilder('attempt')
        .leftJoinAndSelect('attempt.enrollment', 'enrollment')
        .leftJoinAndSelect('enrollment.student', 'student')
        .leftJoinAndSelect('attempt.activityCourse', 'activityCourse')
        .leftJoinAndSelect('activityCourse.activity', 'activity')
        .leftJoinAndSelect('activityCourse.course', 'course')
        .orderBy('attempt.fecha_inicio', 'DESC');
      if (dto.id_estudiante !== undefined) {
        query.andWhere('student.id_estudiante = :id_estudiante', {
          id_estudiante: dto.id_estudiante,
        });
      }
      if (dto.id_curso !== undefined) {
        query.andWhere('course.id_curso = :id_curso', {
          id_curso: dto.id_curso,
        });
      }
      if (dto.id_docente !== undefined) {
        query
          .innerJoin('course.teacher', 'teacher')
          .andWhere('teacher.id_docente = :id_docente', {
            id_docente: dto.id_docente,
          });
      }
      return query.getMany();
    }

    const profiles = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.student', 'student')
      .distinct(true)
      .orderBy('profile.puntos_totales', 'DESC');
    const awardsQuery = this.studentBadgeRepository
      .createQueryBuilder('award')
      .leftJoinAndSelect('award.student', 'student')
      .leftJoinAndSelect('award.badge', 'badge')
      .leftJoinAndSelect('award.course', 'awardCourse')
      .distinct(true);
    if (dto.id_estudiante !== undefined) {
      profiles.andWhere('student.id_estudiante = :id_estudiante', {
        id_estudiante: dto.id_estudiante,
      });
      awardsQuery.andWhere('student.id_estudiante = :id_estudiante', {
        id_estudiante: dto.id_estudiante,
      });
    }
    if (dto.id_curso !== undefined) {
      profiles
        .innerJoin('student.enrollments', 'enrollment')
        .innerJoin('enrollment.course', 'course')
        .andWhere('course.id_curso = :id_curso', {
          id_curso: dto.id_curso,
        })
        .andWhere('enrollment.estado = :estado', { estado: 'activo' });
      awardsQuery
        .innerJoin('student.enrollments', 'awardEnrollment')
        .innerJoin('awardEnrollment.course', 'awardEnrollmentCourse')
        .andWhere('awardEnrollmentCourse.id_curso = :id_curso', {
          id_curso: dto.id_curso,
        })
        .andWhere('awardEnrollment.estado = :awardEnrollmentEstado', {
          awardEnrollmentEstado: 'activo',
        });
    }
    if (dto.id_docente !== undefined) {
      profiles
        .innerJoin('student.enrollments', 'teacherEnrollment')
        .innerJoin('teacherEnrollment.course', 'reportCourse')
        .innerJoin('reportCourse.teacher', 'teacher')
        .andWhere('teacher.id_docente = :id_docente', {
          id_docente: dto.id_docente,
        })
        .andWhere('teacherEnrollment.estado = :teacherEnrollmentEstado', {
          teacherEnrollmentEstado: 'activo',
        });
      awardsQuery
        .innerJoin('student.enrollments', 'awardTeacherEnrollment')
        .innerJoin('awardTeacherEnrollment.course', 'awardTeacherCourse')
        .innerJoin('awardTeacherCourse.teacher', 'awardTeacher')
        .andWhere('awardTeacher.id_docente = :id_docente', {
          id_docente: dto.id_docente,
        })
        .andWhere(
          'awardTeacherEnrollment.estado = :awardTeacherEnrollmentEstado',
          { awardTeacherEnrollmentEstado: 'activo' },
        );
    }
    const [rankedProfiles, awards] = await Promise.all([
      profiles.getMany(),
      awardsQuery.getMany(),
    ]);
    return { perfiles: rankedProfiles, insignias: awards };
  }
}

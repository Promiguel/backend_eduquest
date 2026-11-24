import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { Badge, BadgeCriterion } from '../badge/entities/badge.entity';
import { CompetenceProgress } from '../competence-progress/entities/competence-progress.entity';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { PointTransaction } from '../point-transaction/entities/point-transaction.entity';
import { Student } from '../student/entities/student.entity';
import { StudentBadge } from './entities/student-badge.entity';
import { AwardStudentBadgeDto } from './dto/award-student-badge.dto';
import { FindStudentBadgesQueryDto } from './dto/find-student-badges-query.dto';

@Injectable()
export class StudentBadgeService {
  constructor(
    @InjectRepository(StudentBadge)
    private readonly awardRepository: Repository<StudentBadge>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async award(dto: AwardStudentBadgeDto): Promise<StudentBadge> {
    return this.awardRepository.manager.transaction(async (manager) => {
      const student = await this.lockStudent(manager, dto.id_estudiante);
      const badge = await manager
        .getRepository(Badge)
        .findOneBy({ id_insignia: dto.id_insignia });
      if (!badge) {
        throw new NotFoundException(
          `Insignia con ID ${dto.id_insignia} no encontrada`,
        );
      }
      const course =
        dto.id_curso === undefined
          ? null
          : await manager
              .getRepository(Course)
              .findOneBy({ id_curso: dto.id_curso });
      if (dto.id_curso !== undefined && !course) {
        throw new NotFoundException(
          `Curso con ID ${dto.id_curso} no encontrado`,
        );
      }
      const profileRepository = manager.getRepository(GamificationProfile);
      let profile = await profileRepository.findOne({
        where: { student: { id_estudiante: student.id_estudiante } },
        lock: { mode: 'pessimistic_write' },
      });
      if (!profile) {
        profile = await profileRepository.save(
          profileRepository.create({
            student,
            nivel: 1,
            nivel_actual: 1,
            puntos_totales: 0,
          }),
        );
      }
      const award = await this.awardOne(
        manager,
        student,
        badge,
        course,
        profile,
      );
      if (!award) {
        throw new ConflictException(
          'El estudiante ya obtuvo esta insignia en ese contexto',
        );
      }
      await this.evaluateEligible(
        manager,
        dto.id_estudiante,
        dto.id_curso,
      );
      return award;
    });
  }

  async evaluateEligible(
    manager: EntityManager,
    id_estudiante: number,
    id_curso?: number,
  ): Promise<StudentBadge[]> {
    const student = await this.lockStudent(manager, id_estudiante);
    const profileRepository = manager.getRepository(GamificationProfile);
    let profile = await profileRepository.findOne({
      where: { student: { id_estudiante } },
      lock: { mode: 'pessimistic_write' },
    });
    if (!profile) {
      profile = await profileRepository.save(
        profileRepository.create({
          student,
          nivel: 1,
          nivel_actual: 1,
          puntos_totales: 0,
        }),
      );
    }
    const course =
      id_curso === undefined
        ? null
        : await manager.getRepository(Course).findOneBy({ id_curso });
    if (id_curso !== undefined && !course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }

    const badges = await manager.getRepository(Badge).find({
      order: { id_insignia: 'ASC' },
    });
    const awarded: StudentBadge[] = [];
    let addedBadge = true;
    let passes = 0;
    while (addedBadge && passes <= badges.length) {
      addedBadge = false;
      passes += 1;
      for (const badge of badges) {
        if (
          !(await this.meetsCriterion(
            manager,
            badge.criterio_obtencion,
            profile,
            id_estudiante,
            id_curso,
          ))
        ) {
          continue;
        }
        const newAward = await this.awardOne(
          manager,
          student,
          badge,
          course,
          profile,
        );
        if (newAward) {
          awarded.push(newAward);
          addedBadge = true;
          profile = await profileRepository.findOneByOrFail({
            id_perfil: profile.id_perfil,
          });
        }
      }
    }
    return awarded;
  }

  async findAll(query: FindStudentBadgesQueryDto) {
    const where = {
      ...(query.id_estudiante === undefined
        ? {}
        : { student: { id_estudiante: query.id_estudiante } }),
      ...(query.id_insignia === undefined
        ? {}
        : { badge: { id_insignia: query.id_insignia } }),
      ...(query.id_curso === undefined
        ? {}
        : { course: { id_curso: query.id_curso } }),
    };
    const [data, total] = await this.awardRepository.findAndCount({
      where,
      relations: { student: true, badge: true, course: true },
      order: { fecha_obtencion: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findByStudent(id_estudiante: number) {
    if (!(await this.studentRepository.findOneBy({ id_estudiante }))) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    return this.awardRepository.find({
      where: { student: { id_estudiante } },
      relations: { badge: true, course: true },
      order: { fecha_obtencion: 'DESC' },
    });
  }

  private async meetsCriterion(
    manager: EntityManager,
    criterion: BadgeCriterion,
    profile: GamificationProfile,
    id_estudiante: number,
    id_curso?: number,
  ): Promise<boolean> {
    switch (criterion.tipo) {
      case 'PUNTOS_ACUMULADOS':
        return profile.puntos_totales >= criterion.cantidad;
      case 'ACTIVIDADES_COMPLETADAS': {
        const query = manager
          .getRepository(ActivityAttempt)
          .createQueryBuilder('attempt')
          .innerJoin('attempt.enrollment', 'enrollment')
          .innerJoin('enrollment.student', 'student')
          .innerJoin('attempt.activityCourse', 'activityCourse')
          .where('student.id_estudiante = :id_estudiante', { id_estudiante })
          .andWhere('attempt.estado = :estado', { estado: 'completado' });
        if (id_curso !== undefined) {
          query
            .innerJoin('activityCourse.course', 'course')
            .andWhere('course.id_curso = :id_curso', { id_curso });
        }
        const result = await query
          .select(
            'COUNT(DISTINCT activityCourse.id_actividad_curso)',
            'total',
          )
          .getRawOne<{ total: string | number }>();
        return Number(result?.total ?? 0) >= criterion.cantidad;
      }
      case 'COMPETENCIA_NIVEL': {
        const progress = await manager
          .getRepository(CompetenceProgress)
          .findOne({
            where: {
              student: { id_estudiante },
              competence: { id_competencia: criterion.id_competencia },
            },
          });
        return (progress?.nivel_alcanzado ?? 0) >= criterion.nivel;
      }
    }
  }

  private async awardOne(
    manager: EntityManager,
    student: Student,
    badge: Badge,
    course: Course | null,
    existingProfile?: GamificationProfile,
  ): Promise<StudentBadge | null> {
    const awardRepository = manager.getRepository(StudentBadge);
    const existing = await awardRepository.findOne({
      where: {
        student: { id_estudiante: student.id_estudiante },
        badge: { id_insignia: badge.id_insignia },
        course:
          course === null ? IsNull() : { id_curso: course.id_curso },
      },
    });
    if (existing) {
      return null;
    }
    const award = await awardRepository.save(
      awardRepository.create({ student, badge, course }),
    );
    if (badge.puntos_asociados > 0) {
      const profileRepository = manager.getRepository(GamificationProfile);
      const profile =
        existingProfile ??
        (await profileRepository.findOne({
          where: { student: { id_estudiante: student.id_estudiante } },
          lock: { mode: 'pessimistic_write' },
        }));
      if (!profile) {
        throw new NotFoundException(
          `Perfil de gamificación del estudiante ${student.id_estudiante} no encontrado`,
        );
      }
      profile.puntos_totales += badge.puntos_asociados;
      profile.nivel = this.calculateLevel(profile.puntos_totales);
      profile.nivel_actual = profile.nivel;
      await profileRepository.save(profile);
      await manager.getRepository(PointTransaction).save(
        manager.getRepository(PointTransaction).create({
          profile,
          tipo_transaccion: 'SUMA',
          monto: badge.puntos_asociados,
          descripcion: `Puntos por obtener la insignia ${badge.nombre}`,
        }),
      );
    }
    return award;
  }

  private async lockStudent(
    manager: EntityManager,
    id_estudiante: number,
  ): Promise<Student> {
    const student = await manager.getRepository(Student).findOne({
      where: { id_estudiante },
      lock: { mode: 'pessimistic_write' },
    });
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    return student;
  }

  private calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
  }
}

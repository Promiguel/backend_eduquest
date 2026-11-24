import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { GamificationProfile } from './entities/gamification-profile.entity';
import { FindGamificationProfilesQueryDto } from './dto/find-gamification-profiles-query.dto';

@Injectable()
export class GamificationProfileService {
  constructor(
    @InjectRepository(GamificationProfile)
    private readonly profileRepository: Repository<GamificationProfile>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async createForStudent(
    student: Student,
    manager?: EntityManager,
  ): Promise<GamificationProfile> {
    const repository =
      manager?.getRepository(GamificationProfile) ?? this.profileRepository;
    const existing = await repository.findOneBy({
      student: { id_estudiante: student.id_estudiante },
    });
    if (existing) {
      return existing;
    }
    return repository.save(
      repository.create({
        student,
        nivel: 1,
        nivel_actual: 1,
        puntos_totales: 0,
      }),
    );
  }

  async findByStudent(id_estudiante: number): Promise<GamificationProfile> {
    const student = await this.studentRepository.findOneBy({ id_estudiante });
    if (!student) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    const profile = await this.profileRepository.findOne({
      where: { student: { id_estudiante } },
      relations: { student: { user: true } },
    });
    return profile ?? this.createForStudent(student);
  }

  async findRanking(query: FindGamificationProfilesQueryDto) {
    const [data, total] = await this.profileRepository.findAndCount({
      relations: { student: { user: true } },
      order: { puntos_totales: 'DESC', id_perfil: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findRankingByCourse(
    id_curso: number,
    query: FindGamificationProfilesQueryDto,
  ) {
    const course = await this.courseRepository.findOneBy({ id_curso });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    const queryBuilder = this.profileRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .innerJoin('student.enrollments', 'enrollment')
      .innerJoin('enrollment.course', 'course')
      .where('course.id_curso = :id_curso', { id_curso })
      .andWhere('enrollment.estado = :estado', { estado: 'activo' })
      .distinct(true)
      .orderBy('profile.puntos_totales', 'DESC')
      .addOrderBy('profile.id_perfil', 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    const [data, total] = await queryBuilder.getManyAndCount();
    return createPageResult(data, total, query.page, query.limit);
  }
}

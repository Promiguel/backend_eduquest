import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { Competence } from '../competence/entities/competence.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { CompetenceProgress } from './entities/competence-progress.entity';
import { CreateCompetenceProgressDto } from './dto/create-competence-progress.dto';
import { FindCompetenceProgressQueryDto } from './dto/find-competence-progress-query.dto';

@Injectable()
export class CompetenceProgressService {
  constructor(
    @InjectRepository(CompetenceProgress)
    private readonly progressRepository: Repository<CompetenceProgress>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Competence)
    private readonly competenceRepository: Repository<Competence>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly studentBadgeService: StudentBadgeService,
  ) {}

  async upsert(dto: CreateCompetenceProgressDto): Promise<CompetenceProgress> {
    return this.progressRepository.manager.transaction(async (manager) => {
      const student = await manager.getRepository(Student).findOne({
        where: { id_estudiante: dto.id_estudiante },
        lock: { mode: 'pessimistic_write' },
      });
      if (!student) {
        throw new NotFoundException(
          `Estudiante con ID ${dto.id_estudiante} no encontrado`,
        );
      }
      const competence = await manager
        .getRepository(Competence)
        .findOneBy({ id_competencia: dto.id_competencia });
      if (!competence) {
        throw new NotFoundException(
          `Competencia con ID ${dto.id_competencia} no encontrada`,
        );
      }
      const repository = manager.getRepository(CompetenceProgress);
      let progress = await repository.findOne({
        where: {
          student: { id_estudiante: dto.id_estudiante },
          competence: { id_competencia: dto.id_competencia },
        },
      });
      if (!progress) {
        progress = repository.create({ student, competence });
      }
      progress.nivel_alcanzado = dto.nivel_alcanzado;
      const saved = await repository.save(progress);
      await this.studentBadgeService.evaluateEligible(
        manager,
        dto.id_estudiante,
      );
      return saved;
    });
  }

  async findAll(query: FindCompetenceProgressQueryDto) {
    const [data, total] = await this.progressRepository.findAndCount({
      where: {
        ...(query.id_estudiante === undefined
          ? {}
          : { student: { id_estudiante: query.id_estudiante } }),
        ...(query.id_competencia === undefined
          ? {}
          : { competence: { id_competencia: query.id_competencia } }),
      },
      relations: { student: true, competence: true },
      order: { fecha_actualizacion: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findForStudent(id_estudiante: number) {
    if (!(await this.studentRepository.findOneBy({ id_estudiante }))) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    return this.progressRepository.find({
      where: { student: { id_estudiante } },
      relations: { competence: true },
      order: { competence: { nombre: 'ASC' } },
    });
  }

  async findStudentCompetencies(
    id_estudiante: number,
    id_curso?: number,
  ) {
    if (!(await this.studentRepository.findOneBy({ id_estudiante }))) {
      throw new NotFoundException(
        `Estudiante con ID ${id_estudiante} no encontrado`,
      );
    }
    const competences = await this.findCompetencesForCourse(id_curso);
    const progress = await this.progressRepository.find({
      where: { student: { id_estudiante } },
      relations: { competence: true },
    });
    const byCompetence = new Map(
      progress.map((item) => [item.competence.id_competencia, item]),
    );
    return competences.map((competence) => {
      const item = byCompetence.get(competence.id_competencia);
      return {
        competence,
        nivel_alcanzado: item?.nivel_alcanzado ?? 0,
        fecha_actualizacion: item?.fecha_actualizacion ?? null,
        estado: item ? 'desarrollada' : 'pendiente',
      };
    });
  }

  async findForCourse(id_curso: number) {
    const course = await this.courseRepository.findOne({
      where: { id_curso },
      relations: { subject: true },
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    const enrollments = await this.enrollmentRepository.find({
      where: { course: { id_curso }, estado: 'activo' },
      relations: { student: true },
    });
    if (!enrollments.length) {
      return [];
    }
    const competences = await this.competenceRepository.find({
      where: { subjects: { id_asignatura: course.subject.id_asignatura } },
    });
    if (!competences.length) {
      return [];
    }
    const studentIds = enrollments.map(
      (enrollment) => enrollment.student.id_estudiante,
    );
    const competenceIds = competences.map(
      (competence) => competence.id_competencia,
    );
    return this.progressRepository
      .createQueryBuilder('progress')
      .innerJoinAndSelect('progress.student', 'student')
      .innerJoinAndSelect('progress.competence', 'competence')
      .where('student.id_estudiante IN (:...studentIds)', { studentIds })
      .andWhere('competence.id_competencia IN (:...competenceIds)', {
        competenceIds,
      })
      .orderBy('student.id_estudiante', 'ASC')
      .addOrderBy('competence.nombre', 'ASC')
      .getMany();
  }

  private async findCompetencesForCourse(id_curso?: number) {
    if (id_curso === undefined) {
      return this.competenceRepository.find({ order: { nombre: 'ASC' } });
    }
    const course = await this.courseRepository.findOne({
      where: { id_curso },
      relations: { subject: true },
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    return this.competenceRepository.find({
      where: { subjects: { id_asignatura: course.subject.id_asignatura } },
      order: { nombre: 'ASC' },
    });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Grade } from '../grade/entities/grade.entity';
import { Institution } from '../institution/entities/institution.entity';
import { createPageResult } from '../common/pagination/page-result';
import { Subject } from '../subject/entities/subject.entity';
import { Teacher } from '../teacher/entities/teacher.entity';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    this.validateCourseDates(dto.fecha_inicio, dto.fecha_fin);
    const [institution, grade, subject, teacher] = await Promise.all([
      this.findInstitution(dto.id_institucion),
      this.findGrade(dto.id_grado),
      this.findSubject(dto.id_asignatura),
      this.findTeacher(dto.id_docente),
    ]);
    this.validateGradeInstitution(institution, grade);
    const {
      id_institucion: _id_institucion,
      id_grado: _id_grado,
      id_asignatura: _id_asignatura,
      id_docente: _id_docente,
      ...courseData
    } = dto;

    return this.courseRepository.save(
      this.courseRepository.create({
        ...courseData,
        institution,
        grade,
        subject,
        teacher,
      }),
    );
  }

  async findAll(query: FindCoursesQueryDto) {
    const where: FindOptionsWhere<Course> = {};
    if (query.id_institucion !== undefined) {
      where.institution = { id_institucion: query.id_institucion };
    }
    if (query.id_grado !== undefined) {
      where.grade = { id_grado: query.id_grado };
    }
    if (query.id_asignatura !== undefined) {
      where.subject = { id_asignatura: query.id_asignatura };
    }
    if (query.id_docente !== undefined) {
      where.teacher = { id_docente: query.id_docente };
    }
    if (query.id_estudiante !== undefined) {
      where.enrollments = { student: { id_estudiante: query.id_estudiante } };
    }
    if (query.estado !== undefined) {
      where.estado = query.estado;
    }

    const [data, total] = await this.courseRepository.findAndCount({
      where,
      relations: {
        institution: true,
        grade: true,
        subject: true,
        teacher: true,
      },
      order: { id_curso: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_curso: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id_curso },
      relations: {
        institution: true,
        grade: true,
        subject: true,
        teacher: true,
      },
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id_curso} no encontrado`);
    }
    return course;
  }

  async update(id_curso: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id_curso);
    this.validateCourseDates(
      dto.fecha_inicio ?? course.fecha_inicio,
      dto.fecha_fin ?? course.fecha_fin,
    );
    const {
      id_institucion,
      id_grado,
      id_asignatura,
      id_docente,
      ...courseData
    } = dto;

    if (id_institucion !== undefined || id_grado !== undefined) {
      const [institution, grade] = await Promise.all([
        this.findInstitution(
          id_institucion ?? course.institution.id_institucion,
        ),
        this.findGrade(id_grado ?? course.grade.id_grado),
      ]);
      this.validateGradeInstitution(institution, grade);
      course.institution = institution;
      course.grade = grade;
    }
    if (id_asignatura !== undefined) {
      course.subject = await this.findSubject(id_asignatura);
    }
    if (id_docente !== undefined) {
      course.teacher = await this.findTeacher(id_docente);
    }

    Object.assign(course, courseData);
    return this.courseRepository.save(course);
  }

  async remove(id_curso: number): Promise<void> {
    const course = await this.findOne(id_curso);
    await this.courseRepository.remove(course);
  }

  private async findInstitution(id: number): Promise<Institution> {
    const institution = await this.institutionRepository.findOneBy({
      id_institucion: id,
    });
    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id} no encontrada`);
    }
    return institution;
  }

  private async findGrade(id: number): Promise<Grade> {
    const grade = await this.gradeRepository.findOne({
      where: { id_grado: id },
      relations: { institution: true },
    });
    if (!grade) {
      throw new NotFoundException(`Grado con ID ${id} no encontrado`);
    }
    return grade;
  }

  private async findSubject(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOneBy({
      id_asignatura: id,
    });
    if (!subject) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }
    return subject;
  }

  private async findTeacher(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOneBy({ id_docente: id });
    if (!teacher) {
      throw new NotFoundException(`Docente con ID ${id} no encontrado`);
    }
    return teacher;
  }

  private validateGradeInstitution(
    institution: Institution,
    grade: Grade,
  ): void {
    if (grade.institution.id_institucion !== institution.id_institucion) {
      throw new BadRequestException(
        'El grado seleccionado no pertenece a la institución del curso',
      );
    }
  }

  private validateCourseDates(
    fecha_inicio?: string | Date,
    fecha_fin?: string | Date,
  ): void {
    if (
      fecha_inicio !== undefined &&
      fecha_fin !== undefined &&
      new Date(fecha_inicio).getTime() > new Date(fecha_fin).getTime()
    ) {
      throw new BadRequestException(
        'La fecha de inicio del curso no puede ser posterior a la fecha de fin',
      );
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Course } from '../course/entities/course.entity';
import { createPageResult } from '../common/pagination/page-result';
import { Student } from '../student/entities/student.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { FindEnrollmentsQueryDto } from './dto/find-enrollments-query.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
    const [student, course] = await Promise.all([
      this.findStudent(dto.id_estudiante),
      this.findCourse(dto.id_curso),
    ]);
    const {
      id_estudiante: _id_estudiante,
      id_curso: _id_curso,
      ...enrollmentData
    } = dto;
    return this.enrollmentRepository.save(
      this.enrollmentRepository.create({
        ...enrollmentData,
        student,
        course,
      }),
    );
  }

  async findAll(query: FindEnrollmentsQueryDto) {
    const where: FindOptionsWhere<Enrollment> = {};
    if (query.id_estudiante !== undefined) {
      where.student = { id_estudiante: query.id_estudiante };
    }
    if (query.id_curso !== undefined) {
      where.course = { id_curso: query.id_curso };
    }
    if (query.estado !== undefined) {
      where.estado = query.estado;
    }

    const [data, total] = await this.enrollmentRepository.findAndCount({
      where,
      relations: { student: true, course: true },
      order: { id_inscripcion: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_inscripcion: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id_inscripcion },
      relations: { student: true, course: true },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Inscripción con ID ${id_inscripcion} no encontrada`,
      );
    }
    return enrollment;
  }

  async update(
    id_inscripcion: number,
    dto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id_inscripcion);
    const { id_estudiante, id_curso, ...enrollmentData } = dto;
    if (id_estudiante !== undefined) {
      enrollment.student = await this.findStudent(id_estudiante);
    }
    if (id_curso !== undefined) {
      enrollment.course = await this.findCourse(id_curso);
    }
    Object.assign(enrollment, enrollmentData);
    return this.enrollmentRepository.save(enrollment);
  }

  async remove(id_inscripcion: number): Promise<void> {
    const enrollment = await this.findOne(id_inscripcion);
    await this.enrollmentRepository.remove(enrollment);
  }

  private async findStudent(id: number): Promise<Student> {
    const student = await this.studentRepository.findOneBy({
      id_estudiante: id,
    });
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  private async findCourse(id: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id_curso: id });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }
}

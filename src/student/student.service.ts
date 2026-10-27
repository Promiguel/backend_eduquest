import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create({
      ...createStudentDto,
      user: { id_usuario: createStudentDto.id_usuario } as any,
    });
    return await this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: { user: true },
      order: { id_estudiante: 'ASC' },
    });
  }

  async findOne(id_estudiante: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id_estudiante },
      relations: { user: true },
    });

    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id_estudiante} no encontrado`);
    }

    return student;
  }

  async findByUserId(id_usuario: number): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { user: { id_usuario } },
      relations: { user: true },
    });
  }

  async findByCarrera(carrera: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { carrera },
      relations: { user: true },
    });
  }

  async update(id_estudiante: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id_estudiante);

    if (updateStudentDto.id_usuario) {
      student.user = { id_usuario: updateStudentDto.id_usuario } as any;
      delete (updateStudentDto as any).id_usuario;
    }

    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(id_estudiante: number): Promise<void> {
    const student = await this.findOne(id_estudiante);
    await this.studentRepository.remove(student);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      user: { id_usuario: createTeacherDto.id_usuario } as any,
    });
    return await this.teacherRepository.save(teacher);
  }

  async findAll(): Promise<Teacher[]> {
    return await this.teacherRepository.find({
      relations: { user: true },
      order: { id_docente: 'ASC' },
    });
  }

  async findOne(id_docente: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id_docente },
      relations: { user: true },
    });

    if (!teacher) {
      throw new NotFoundException(`Docente con ID ${id_docente} no encontrado`);
    }

    return teacher;
  }

  async findByUserId(id_usuario: number): Promise<Teacher | null> {
    return await this.teacherRepository.findOne({
      where: { user: { id_usuario } },
      relations: { user: true },
    });
  }

  async findByEspecialidad(especialidad: string): Promise<Teacher[]> {
    return await this.teacherRepository.find({
      where: { especialidad },
      relations: { user: true },
    });
  }

  async update(id_docente: number, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id_docente);

    if (updateTeacherDto.id_usuario) {
      teacher.user = { id_usuario: updateTeacherDto.id_usuario } as any;
      delete (updateTeacherDto as any).id_usuario;
    }

    Object.assign(teacher, updateTeacherDto);
    return await this.teacherRepository.save(teacher);
  }

  async remove(id_docente: number): Promise<void> {
    const teacher = await this.findOne(id_docente);
    await this.teacherRepository.remove(teacher);
  }
}

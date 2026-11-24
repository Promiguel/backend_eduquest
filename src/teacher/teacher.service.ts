import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const user = await this.userRepository.findOneBy({
      id_usuario: createTeacherDto.id_usuario,
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${createTeacherDto.id_usuario} no encontrado`,
      );
    }
    if (
      await this.teacherRepository.findOne({
        where: { user: { id_usuario: user.id_usuario } },
      })
    ) {
      throw new ConflictException(
        `El usuario ${user.id_usuario} ya tiene un perfil de docente`,
      );
    }
    const teacher = this.teacherRepository.create({
      codigo_docente: createTeacherDto.codigo_docente,
      especialidad: createTeacherDto.especialidad,
      titulo: createTeacherDto.titulo,
      estado: createTeacherDto.estado,
      user,
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
    const { id_usuario, ...teacherData } = updateTeacherDto;
    if (id_usuario !== undefined) {
      const user = await this.userRepository.findOneBy({ id_usuario });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
      }
      const existing = await this.teacherRepository.findOne({
        where: { user: { id_usuario } },
      });
      if (existing && existing.id_docente !== id_docente) {
        throw new ConflictException(
          `El usuario ${id_usuario} ya tiene un perfil de docente`,
        );
      }
      teacher.user = user;
    }

    Object.assign(teacher, teacherData);
    return await this.teacherRepository.save(teacher);
  }

  async remove(id_docente: number): Promise<void> {
    const teacher = await this.findOne(id_docente);
    await this.teacherRepository.remove(teacher);
  }
}

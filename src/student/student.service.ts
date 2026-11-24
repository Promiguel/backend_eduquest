import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { GamificationProfileService } from '../gamification-profile/gamification-profile.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly gamificationProfileService: GamificationProfileService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(Student);
      const user = await manager.getRepository(User).findOneBy({
        id_usuario: createStudentDto.id_usuario,
      });
      if (!user) {
        throw new NotFoundException(
          `Usuario con ID ${createStudentDto.id_usuario} no encontrado`,
        );
      }
      const existing = await repository.findOne({
        where: { user: { id_usuario: user.id_usuario } },
      });
      if (existing) {
        throw new ConflictException(
          `El usuario ${user.id_usuario} ya tiene un perfil de estudiante`,
        );
      }
      const student = repository.create({
        codigo_estudiante: createStudentDto.codigo_estudiante,
        carrera: createStudentDto.carrera,
        semestre: createStudentDto.semestre,
        estado: createStudentDto.estado,
        user,
      });
      const saved = await repository.save(student);
      await this.gamificationProfileService.createForStudent(saved, manager);
      return saved;
    });
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
    const { id_usuario, ...studentData } = updateStudentDto;
    if (id_usuario !== undefined) {
      const user = await this.userRepository.findOneBy({ id_usuario });
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
      }
      const existing = await this.studentRepository.findOne({
        where: { user: { id_usuario } },
      });
      if (existing && existing.id_estudiante !== id_estudiante) {
        throw new ConflictException(
          `El usuario ${id_usuario} ya tiene un perfil de estudiante`,
        );
      }
      student.user = user;
    }

    Object.assign(student, studentData);
    return await this.studentRepository.save(student);
  }

  async remove(id_estudiante: number): Promise<void> {
    const student = await this.findOne(id_estudiante);
    await this.studentRepository.remove(student);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const contrasena_hash = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...userData,
      contrasena_hash,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id_usuario: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id_usuario } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    }
    return user;
  }

  async findByEmailWithPassword(correo: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { correo },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        contrasena_hash: true,
        rol: true,
        estado: true,
      },
    });
  }

  async update(id_usuario: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id_usuario);

    if (updateUserDto.password) {
      user.contrasena_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id_usuario: number): Promise<void> {
    const user = await this.findOne(id_usuario);
    await this.userRepository.remove(user);
  }
}
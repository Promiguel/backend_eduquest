import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

type PublicUser = Omit<
  User,
  'contrasena_hash' | 'rol' | 'userRoles'
> & {
  roles: Role[];
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<PublicUser> {
    const existing = await this.userRepository.findOneBy({
      correo: createUserDto.correo,
    });
    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const { password, roleIds, ...userData } = createUserDto;
    this.validateUniqueRoleIds(roleIds);
    const contrasena_hash = await bcrypt.hash(password, 10);

    const userId = await this.dataSource.transaction(async (manager) => {
      const roles = await manager.find(Role, {
        where: { id_rol: In(roleIds) },
      });
      if (roles.length !== roleIds.length) {
        throw new NotFoundException('Uno o más roles no existen');
      }

      const newUser = manager.create(User, {
        ...userData,
        contrasena_hash,
      });
      const savedUser = await manager.save(User, newUser);
      await manager.save(
        UserRole,
        roleIds.map((id_rol) =>
          manager.create(UserRole, {
            id_usuario: savedUser.id_usuario,
            id_rol,
          }),
        ),
      );
      return savedUser.id_usuario;
    });

    return this.findOne(userId);
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepository.find({
      relations: { userRoles: { role: true } },
      order: { id_usuario: 'ASC' },
    });
    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id_usuario: number): Promise<PublicUser> {
    const user = await this.userRepository.findOne({
      where: { id_usuario },
      relations: { userRoles: { role: true } },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    }
    return this.toPublicUser(user);
  }

  async findByEmailWithPassword(correo: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.contrasena_hash')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.correo = :correo', { correo })
      .getOne();
  }

  async update(
    id_usuario: number,
    updateUserDto: UpdateUserDto,
  ): Promise<PublicUser> {
    const user = await this.userRepository.findOneBy({ id_usuario });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    }
    const { password, correo, ...userData } = updateUserDto;

    if (correo !== undefined && correo !== user.correo) {
      const existing = await this.userRepository.findOneBy({ correo });
      if (existing && existing.id_usuario !== id_usuario) {
        throw new ConflictException(
          'El correo electrónico ya está registrado',
        );
      }
    }
    if (password !== undefined) {
      user.contrasena_hash = await bcrypt.hash(password, 10);
    }
    if (correo !== undefined) user.correo = correo;
    Object.assign(user, userData);
    await this.userRepository.save(user);
    return this.findOne(id_usuario);
  }

  async remove(id_usuario: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id_usuario });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    }
    await this.userRepository.remove(user);
  }

  async getRoles(id_usuario: number): Promise<Role[]> {
    return (await this.findOne(id_usuario)).roles;
  }

  async addRole(id_usuario: number, id_rol: number): Promise<Role[]> {
    await this.findOne(id_usuario);
    const role = await this.roleRepository.findOneBy({ id_rol });
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id_rol} no encontrado`);
    }

    await this.userRoleRepository.upsert(
      { id_usuario, id_rol },
      ['id_usuario', 'id_rol'],
    );
    return this.getRoles(id_usuario);
  }

  async removeRole(id_usuario: number, id_rol: number): Promise<Role[]> {
    await this.findOne(id_usuario);
    const role = await this.roleRepository.findOneBy({ id_rol });
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id_rol} no encontrado`);
    }

    const assignment = await this.userRoleRepository.findOneBy({
      id_usuario,
      id_rol,
    });
    if (!assignment) {
      throw new NotFoundException('El usuario no tiene asignado ese rol');
    }
    await this.userRoleRepository.remove(assignment);
    return this.getRoles(id_usuario);
  }

  private validateUniqueRoleIds(roleIds: number[]): void {
    if (new Set(roleIds).size !== roleIds.length) {
      throw new BadRequestException('No se permiten roles duplicados');
    }
  }

  private toPublicUser(user: User): PublicUser {
    const {
      contrasena_hash: _hash,
      rol: _legacyRole,
      userRoles,
      ...publicUser
    } = user;
    const roles = (userRoles ?? [])
      .map((userRole) => userRole.role)
      .sort((left, right) => left.id_rol - right.id_rol);
    return { ...publicUser, roles };
  }
}
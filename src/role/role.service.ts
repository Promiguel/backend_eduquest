import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      order: { id_rol: 'ASC' },
    });
  }

  async findOne(id_rol: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id_rol } });
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id_rol} no encontrado`);
    }
    return role;
  }

  async findByNombre(nombre: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { nombre },
    });
  }

  async update(id_rol: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id_rol);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id_rol: number): Promise<void> {
    const role = await this.findOne(id_rol);
    await this.roleRepository.remove(role);
  }
}

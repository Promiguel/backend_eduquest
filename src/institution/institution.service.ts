import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async create(createInstitutionDto: CreateInstitutionDto): Promise<Institution> {
    const institution = this.institutionRepository.create(createInstitutionDto);
    return await this.institutionRepository.save(institution);
  }

  async findAll(): Promise<Institution[]> {
    return await this.institutionRepository.find({
      order: { id_institucion: 'ASC' },
    });
  }

  async findOne(id_institucion: number): Promise<Institution> {
    const institution = await this.institutionRepository.findOne({
      where: { id_institucion },
    });

    if (!institution) {
      throw new NotFoundException(`Institución con ID ${id_institucion} no encontrada`);
    }

    return institution;
  }

  async findByNombre(nombre: string): Promise<Institution | null> {
    return await this.institutionRepository.findOne({
      where: { nombre },
    });
  }

  async findByEstado(estado: string): Promise<Institution[]> {
    return await this.institutionRepository.find({
      where: { estado },
      order: { nombre: 'ASC' },
    });
  }

  async update(
    id_institucion: number,
    updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Institution> {
    const institution = await this.findOne(id_institucion);
    Object.assign(institution, updateInstitutionDto);
    return await this.institutionRepository.save(institution);
  }

  async remove(id_institucion: number): Promise<void> {
    const institution = await this.findOne(id_institucion);
    await this.institutionRepository.remove(institution);
  }
}

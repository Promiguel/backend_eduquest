import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Subject } from '../subject/entities/subject.entity';
import { CreateThematicUnitDto } from './dto/create-thematic-unit.dto';
import { FindThematicUnitsQueryDto } from './dto/find-thematic-units-query.dto';
import { UpdateThematicUnitDto } from './dto/update-thematic-unit.dto';
import { ThematicUnit } from './entities/thematic-unit.entity';

@Injectable()
export class ThematicUnitService {
  constructor(
    @InjectRepository(ThematicUnit)
    private readonly unitRepository: Repository<ThematicUnit>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateThematicUnitDto): Promise<ThematicUnit> {
    const subject = await this.findSubject(dto.id_asignatura);
    const { id_asignatura: _id_asignatura, ...unitData } = dto;
    return this.unitRepository.save(
      this.unitRepository.create({ ...unitData, subject }),
    );
  }

  async findAll(query: FindThematicUnitsQueryDto) {
    const where: FindOptionsWhere<ThematicUnit> = {};
    if (query.id_asignatura !== undefined) {
      where.subject = { id_asignatura: query.id_asignatura };
    }

    const [data, total] = await this.unitRepository.findAndCount({
      where,
      relations: { subject: true },
      order: { id_unidad: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_unidad: number): Promise<ThematicUnit> {
    const unit = await this.unitRepository.findOne({
      where: { id_unidad },
      relations: { subject: true },
    });
    if (!unit) {
      throw new NotFoundException(
        `Unidad temática con ID ${id_unidad} no encontrada`,
      );
    }
    return unit;
  }

  async update(
    id_unidad: number,
    dto: UpdateThematicUnitDto,
  ): Promise<ThematicUnit> {
    const unit = await this.findOne(id_unidad);
    const { id_asignatura, ...unitData } = dto;
    if (id_asignatura !== undefined) {
      unit.subject = await this.findSubject(id_asignatura);
    }
    Object.assign(unit, unitData);
    return this.unitRepository.save(unit);
  }

  async remove(id_unidad: number): Promise<void> {
    const unit = await this.findOne(id_unidad);
    await this.unitRepository.remove(unit);
  }

  private async findSubject(id_asignatura: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOneBy({ id_asignatura });
    if (!subject) {
      throw new NotFoundException(
        `Asignatura con ID ${id_asignatura} no encontrada`,
      );
    }
    return subject;
  }
}

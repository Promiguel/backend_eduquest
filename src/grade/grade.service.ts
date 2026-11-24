import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Institution } from '../institution/entities/institution.entity';
import { createPageResult } from '../common/pagination/page-result';
import { CreateGradeDto } from './dto/create-grade.dto';
import { FindGradesQueryDto } from './dto/find-grades-query.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,
  ) {}

  async create(dto: CreateGradeDto): Promise<Grade> {
    const institution = await this.findInstitution(dto.id_institucion);
    const { id_institucion: _id_institucion, ...gradeData } = dto;
    return this.gradeRepository.save(
      this.gradeRepository.create({ ...gradeData, institution }),
    );
  }

  async findAll(query: FindGradesQueryDto) {
    const where: FindOptionsWhere<Grade> = {};
    if (query.id_institucion !== undefined) {
      where.institution = { id_institucion: query.id_institucion };
    }

    const [data, total] = await this.gradeRepository.findAndCount({
      where,
      relations: { institution: true },
      order: { id_grado: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_grado: number): Promise<Grade> {
    const grade = await this.gradeRepository.findOne({
      where: { id_grado },
      relations: { institution: true },
    });
    if (!grade) {
      throw new NotFoundException(`Grado con ID ${id_grado} no encontrado`);
    }
    return grade;
  }

  async update(id_grado: number, dto: UpdateGradeDto): Promise<Grade> {
    const grade = await this.findOne(id_grado);
    const { id_institucion, ...gradeData } = dto;
    if (id_institucion !== undefined) {
      grade.institution = await this.findInstitution(id_institucion);
    }
    Object.assign(grade, gradeData);
    return this.gradeRepository.save(grade);
  }

  async remove(id_grado: number): Promise<void> {
    const grade = await this.findOne(id_grado);
    await this.gradeRepository.remove(grade);
  }

  private async findInstitution(id_institucion: number): Promise<Institution> {
    const institution = await this.institutionRepository.findOneBy({
      id_institucion,
    });
    if (!institution) {
      throw new NotFoundException(
        `Institución con ID ${id_institucion} no encontrada`,
      );
    }
    return institution;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Subject } from '../subject/entities/subject.entity';
import { CreateCompetenceDto } from './dto/create-competence.dto';
import { FindCompetencesQueryDto } from './dto/find-competences-query.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { Competence } from './entities/competence.entity';

@Injectable()
export class CompetenceService {
  constructor(
    @InjectRepository(Competence)
    private readonly competenceRepository: Repository<Competence>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateCompetenceDto): Promise<Competence> {
    const { id_asignaturas, ...competenceData } = dto;
    const subjects = id_asignaturas
      ? await this.findSubjects(id_asignaturas)
      : [];
    return this.competenceRepository.save(
      this.competenceRepository.create({ ...competenceData, subjects }),
    );
  }

  async findAll(query: FindCompetencesQueryDto) {
    const queryBuilder = this.competenceRepository
      .createQueryBuilder('competence')
      .leftJoinAndSelect('competence.subjects', 'subject')
      .orderBy('competence.id_competencia', 'ASC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.tipo !== undefined) {
      queryBuilder.andWhere('competence.tipo = :tipo', { tipo: query.tipo });
    }
    if (query.id_asignatura !== undefined) {
      queryBuilder
        .innerJoin('competence.subjects', 'subject_filter')
        .andWhere('subject_filter.id_asignatura = :id_asignatura', {
          id_asignatura: query.id_asignatura,
        });
    }
    const [data, total] = await queryBuilder.getManyAndCount();
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_competencia: number): Promise<Competence> {
    const competence = await this.competenceRepository.findOne({
      where: { id_competencia },
      relations: { subjects: true },
    });
    if (!competence) {
      throw new NotFoundException(
        `Competencia con ID ${id_competencia} no encontrada`,
      );
    }
    return competence;
  }

  async update(
    id_competencia: number,
    dto: UpdateCompetenceDto,
  ): Promise<Competence> {
    const competence = await this.findOne(id_competencia);
    const { id_asignaturas, ...competenceData } = dto;
    if (id_asignaturas !== undefined) {
      competence.subjects = await this.findSubjects(id_asignaturas);
    }
    Object.assign(competence, competenceData);
    return this.competenceRepository.save(competence);
  }

  async remove(id_competencia: number): Promise<void> {
    const competence = await this.findOne(id_competencia);
    await this.competenceRepository.remove(competence);
  }

  private async findSubjects(ids: number[]): Promise<Subject[]> {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length === 0) {
      return [];
    }
    const subjects = await this.subjectRepository
      .createQueryBuilder('subject')
      .where('subject.id_asignatura IN (:...ids)', { ids: uniqueIds })
      .getMany();
    if (subjects.length !== uniqueIds.length) {
      const foundIds = new Set(
        subjects.map((subject) => subject.id_asignatura),
      );
      const missingIds = uniqueIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(
        `Asignaturas no encontradas: ${missingIds.join(', ')}`,
      );
    }
    return subjects;
  }
}

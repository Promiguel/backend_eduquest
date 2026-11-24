import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Rubric } from '../rubric/entities/rubric.entity';
import { RubricCriterion } from './entities/rubric-criterion.entity';
import { CreateRubricCriterionDto } from './dto/create-rubric-criterion.dto';
import { FindRubricCriteriaQueryDto } from './dto/find-rubric-criteria-query.dto';
import { UpdateRubricCriterionDto } from './dto/update-rubric-criterion.dto';

@Injectable()
export class RubricCriterionService {
  constructor(
    @InjectRepository(RubricCriterion)
    private readonly criterionRepository: Repository<RubricCriterion>,
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
  ) {}

  async create(dto: CreateRubricCriterionDto): Promise<RubricCriterion> {
    this.validateMaximum(dto.puntaje, dto.maximo);
    const rubric = await this.findRubric(dto.id_rubrica);
    const { id_rubrica: _id_rubrica, ...data } = dto;
    return this.criterionRepository.save(
      this.criterionRepository.create({ ...data, rubric }),
    );
  }

  async findAll(query: FindRubricCriteriaQueryDto) {
    const [data, total] = await this.criterionRepository.findAndCount({
      where:
        query.id_rubrica === undefined
          ? {}
          : { rubric: { id_rubrica: query.id_rubrica } },
      relations: { rubric: true },
      order: { id_criterio: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_criterio: number): Promise<RubricCriterion> {
    const criterion = await this.criterionRepository.findOne({
      where: { id_criterio },
      relations: { rubric: true },
    });
    if (!criterion) {
      throw new NotFoundException(
        `Criterio de rúbrica con ID ${id_criterio} no encontrado`,
      );
    }
    return criterion;
  }

  async update(
    id_criterio: number,
    dto: UpdateRubricCriterionDto,
  ): Promise<RubricCriterion> {
    const criterion = await this.findOne(id_criterio);
    const { id_rubrica, puntaje, maximo, ...data } = dto;
    this.validateMaximum(
      puntaje ?? criterion.puntaje,
      maximo ?? criterion.maximo,
    );
    if (id_rubrica !== undefined) {
      if (id_rubrica !== criterion.rubric.id_rubrica) {
        await this.ensureNotUsed(id_criterio);
      }
      criterion.rubric = await this.findRubric(id_rubrica);
    }
    Object.assign(criterion, data);
    if (puntaje !== undefined) criterion.puntaje = puntaje;
    if (maximo !== undefined) criterion.maximo = maximo;
    return this.criterionRepository.save(criterion);
  }

  async remove(id_criterio: number): Promise<void> {
    const criterion = await this.findOne(id_criterio);
    await this.ensureNotUsed(id_criterio);
    await this.criterionRepository.remove(criterion);
  }

  private async ensureNotUsed(id_criterio: number): Promise<void> {
    const evaluationCount = await this.criterionRepository
      .createQueryBuilder('criterion')
      .innerJoin('criterion.evaluationCriteria', 'evaluationCriterion')
      .where('criterion.id_criterio = :id_criterio', { id_criterio })
      .getCount();
    if (evaluationCount > 0) {
      throw new ConflictException(
        'No se puede modificar o eliminar un criterio que ya fue evaluado',
      );
    }
  }

  private validateMaximum(puntaje: number, maximo: number): void {
    if (puntaje > maximo) {
      throw new BadRequestException(
        'El puntaje del criterio no puede superar su máximo',
      );
    }
  }

  private async findRubric(id_rubrica: number): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOneBy({ id_rubrica });
    if (!rubric) {
      throw new NotFoundException(`Rúbrica con ID ${id_rubrica} no encontrada`);
    }
    return rubric;
  }
}

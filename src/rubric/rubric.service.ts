import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Rubric } from './entities/rubric.entity';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { FindRubricsQueryDto } from './dto/find-rubrics-query.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';

@Injectable()
export class RubricService {
  constructor(
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
  ) {}

  async create(dto: CreateRubricDto): Promise<Rubric> {
    return this.rubricRepository.save(this.rubricRepository.create(dto));
  }

  async findAll(query: FindRubricsQueryDto) {
    const [data, total] = await this.rubricRepository.findAndCount({
      where: query.tipo === undefined ? {} : { tipo: query.tipo },
      order: { id_rubrica: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_rubrica: number): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOne({
      where: { id_rubrica },
      relations: { criteria: true },
    });
    if (!rubric) {
      throw new NotFoundException(`Rúbrica con ID ${id_rubrica} no encontrada`);
    }
    return rubric;
  }

  async update(id_rubrica: number, dto: UpdateRubricDto): Promise<Rubric> {
    const rubric = await this.findOne(id_rubrica);
    Object.assign(rubric, dto);
    return this.rubricRepository.save(rubric);
  }

  async remove(id_rubrica: number): Promise<void> {
    const rubric = await this.findOne(id_rubrica);
    const evaluatedCriteria = await this.rubricRepository
      .createQueryBuilder('rubric')
      .innerJoin('rubric.criteria', 'criterion')
      .innerJoin('criterion.evaluationCriteria', 'evaluationCriterion')
      .where('rubric.id_rubrica = :id_rubrica', { id_rubrica })
      .getCount();
    if (evaluatedCriteria > 0) {
      throw new ConflictException(
        'No se puede eliminar una rúbrica cuyos criterios ya fueron evaluados',
      );
    }
    await this.rubricRepository.remove(rubric);
  }
}

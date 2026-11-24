import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { EvaluationService } from '../evaluation/evaluation.service';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { EvaluationCriterion } from './entities/evaluation-criterion.entity';
import { CreateEvaluationCriterionDto } from './dto/create-evaluation-criterion.dto';
import { FindEvaluationCriteriaQueryDto } from './dto/find-evaluation-criteria-query.dto';
import { UpdateEvaluationCriterionDto } from './dto/update-evaluation-criterion.dto';

@Injectable()
export class EvaluationCriterionService {
  constructor(
    @InjectRepository(EvaluationCriterion)
    private readonly evaluationCriterionRepository: Repository<EvaluationCriterion>,
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(RubricCriterion)
    private readonly rubricCriterionRepository: Repository<RubricCriterion>,
    private readonly evaluationService: EvaluationService,
  ) {}

  async create(
    dto: CreateEvaluationCriterionDto,
  ): Promise<EvaluationCriterion> {
    const existing = await this.evaluationCriterionRepository.findOneBy({
      id_evaluacion: dto.id_evaluacion,
      id_criterio: dto.id_criterio,
    });
    if (existing) {
      throw new ConflictException(
        'El criterio ya fue registrado en esta evaluación',
      );
    }
    const [evaluation, criterion] = await Promise.all([
      this.findEvaluation(dto.id_evaluacion),
      this.findCriterion(dto.id_criterio),
    ]);
    this.validateCriterion(evaluation, criterion, dto.puntaje_asignado);
    const { id_evaluacion, id_criterio, ...data } = dto;
    const evaluationCriterion = this.evaluationCriterionRepository.create({
      id_evaluacion,
      id_criterio,
      ...data,
      evaluation,
      criterion,
    });
    const saved =
      await this.evaluationCriterionRepository.save(evaluationCriterion);
    await this.recalculateEvaluation(id_evaluacion);
    return saved;
  }

  async findAll(query: FindEvaluationCriteriaQueryDto) {
    const [data, total] = await this.evaluationCriterionRepository.findAndCount(
      {
        where:
          query.id_evaluacion === undefined
            ? {}
            : { id_evaluacion: query.id_evaluacion },
        relations: { evaluation: true, criterion: true },
        order: { id_evaluacion: 'ASC', id_criterio: 'ASC' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      },
    );
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(
    id_evaluacion: number,
    id_criterio: number,
  ): Promise<EvaluationCriterion> {
    const evaluationCriterion =
      await this.evaluationCriterionRepository.findOne({
        where: { id_evaluacion, id_criterio },
        relations: {
          evaluation: {
            activityCourse: { activity: { rubric: true } },
          },
          criterion: { rubric: true },
        },
      });
    if (!evaluationCriterion) {
      throw new NotFoundException(
        `Criterio ${id_criterio} no encontrado en la evaluación ${id_evaluacion}`,
      );
    }
    return evaluationCriterion;
  }

  async update(
    id_evaluacion: number,
    id_criterio: number,
    dto: UpdateEvaluationCriterionDto,
  ): Promise<EvaluationCriterion> {
    const evaluationCriterion = await this.findOne(id_evaluacion, id_criterio);
    if (dto.puntaje_asignado !== undefined) {
      this.validateCriterion(
        evaluationCriterion.evaluation,
        evaluationCriterion.criterion,
        dto.puntaje_asignado,
      );
      evaluationCriterion.puntaje_asignado = dto.puntaje_asignado;
    }
    if (dto.observacion !== undefined) {
      evaluationCriterion.observacion = dto.observacion;
    }
    const saved =
      await this.evaluationCriterionRepository.save(evaluationCriterion);
    await this.recalculateEvaluation(id_evaluacion);
    return saved;
  }

  async remove(id_evaluacion: number, id_criterio: number): Promise<void> {
    const evaluationCriterion = await this.findOne(id_evaluacion, id_criterio);
    await this.evaluationCriterionRepository.remove(evaluationCriterion);
    await this.recalculateEvaluation(id_evaluacion);
  }

  private validateCriterion(
    evaluation: Evaluation,
    criterion: RubricCriterion,
    score: number,
  ): void {
    const rubricId = evaluation.activityCourse.activity.rubric?.id_rubrica;
    if (rubricId === undefined || criterion.rubric.id_rubrica !== rubricId) {
      throw new BadRequestException(
        'El criterio no pertenece a la rúbrica asignada a esta actividad',
      );
    }
    if (score > criterion.maximo) {
      throw new BadRequestException(
        'El puntaje asignado no puede superar el máximo del criterio',
      );
    }
  }

  private async recalculateEvaluation(id_evaluacion: number): Promise<void> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id_evaluacion },
      relations: {
        activityCourse: {
          activity: { rubric: true },
        },
        criteria: { criterion: true },
      },
    });
    if (!evaluation) {
      throw new NotFoundException(
        `Evaluación con ID ${id_evaluacion} no encontrada`,
      );
    }
    await this.evaluationService.recalculateEntity(evaluation);
    await this.evaluationRepository.save(evaluation);
  }

  private async findEvaluation(id_evaluacion: number): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id_evaluacion },
      relations: { activityCourse: { activity: { rubric: true } } },
    });
    if (!evaluation) {
      throw new NotFoundException(
        `Evaluación con ID ${id_evaluacion} no encontrada`,
      );
    }
    return evaluation;
  }

  private async findCriterion(id_criterio: number): Promise<RubricCriterion> {
    const criterion = await this.rubricCriterionRepository.findOne({
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
}

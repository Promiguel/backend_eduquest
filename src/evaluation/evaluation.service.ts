import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ActivityCourse } from '../activity-course/entities/activity-course.entity';
import { RubricCriterion } from '../rubric-criterion/entities/rubric-criterion.entity';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { FindEvaluationsQueryDto } from './dto/find-evaluations-query.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(ActivityCourse)
    private readonly activityCourseRepository: Repository<ActivityCourse>,
    @InjectRepository(RubricCriterion)
    private readonly rubricCriterionRepository: Repository<RubricCriterion>,
  ) {}

  async create(dto: CreateEvaluationDto): Promise<Evaluation> {
    const activityCourse = await this.activityCourseRepository.findOneBy({
      id_actividad_curso: dto.id_actividad_curso,
    });
    if (!activityCourse) {
      throw new NotFoundException(
        `Actividad de curso con ID ${dto.id_actividad_curso} no encontrada`,
      );
    }
    return this.evaluationRepository.save(
      this.evaluationRepository.create({
        activityCourse,
        retroalimentacion_auto: dto.retroalimentacion_auto,
        nota_final: 0,
        porcentaje: 0,
        nota_modificada: false,
      }),
    );
  }

  async findAll(query: FindEvaluationsQueryDto) {
    const [data, total] = await this.evaluationRepository.findAndCount({
      where:
        query.id_actividad_curso === undefined
          ? {}
          : {
              activityCourse: {
                id_actividad_curso: query.id_actividad_curso,
              },
            },
      relations: { activityCourse: true },
      order: { id_evaluacion: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_evaluacion: number): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id_evaluacion },
      relations: {
        activityCourse: { activity: { rubric: true } },
        criteria: { criterion: true },
      },
    });
    if (!evaluation) {
      throw new NotFoundException(
        `Evaluación con ID ${id_evaluacion} no encontrada`,
      );
    }
    return evaluation;
  }

  async update(
    id_evaluacion: number,
    dto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    const evaluation = await this.findOne(id_evaluacion);
    if (dto.nota_final !== undefined) {
      const maximum = evaluation.activityCourse.activity.puntaje_maximo;
      if (dto.nota_final > maximum) {
        throw new BadRequestException(
          'La nota final no puede superar el puntaje máximo de la actividad',
        );
      }
      evaluation.nota_final = dto.nota_final;
      evaluation.porcentaje =
        maximum === 0 ? 0 : this.round((dto.nota_final / maximum) * 100);
      evaluation.nota_modificada = true;
    }
    if (dto.retroalimentacion_auto !== undefined) {
      evaluation.retroalimentacion_auto = dto.retroalimentacion_auto;
    }
    if (dto.retroalimentacion_docente !== undefined) {
      evaluation.retroalimentacion_docente = dto.retroalimentacion_docente;
    }
    return this.evaluationRepository.save(evaluation);
  }

  async recalculate(id_evaluacion: number): Promise<Evaluation> {
    const evaluation = await this.findOne(id_evaluacion);
    evaluation.nota_modificada = false;
    await this.recalculateEntity(evaluation);
    return this.evaluationRepository.save(evaluation);
  }

  async recalculateEntity(evaluation: Evaluation): Promise<void> {
    if (evaluation.nota_modificada) {
      return;
    }
    const rubric = evaluation.activityCourse.activity.rubric;
    const criteria = rubric
      ? await this.rubricCriterionRepository.find({
          where: { rubric: { id_rubrica: rubric.id_rubrica } },
        })
      : [];
    const totalWeight = criteria.reduce(
      (total, criterion) => total + Number(criterion.peso),
      0,
    );
    const earnedWeight = evaluation.criteria.reduce(
      (total, evaluationCriterion) => {
        const criterion = evaluationCriterion.criterion;
        if (!criterion || criterion.maximo <= 0) {
          return total;
        }
        return (
          total +
          (evaluationCriterion.puntaje_asignado / criterion.maximo) *
            criterion.peso
        );
      },
      0,
    );
    const percentage =
      totalWeight === 0 ? 0 : this.round((earnedWeight / totalWeight) * 100);
    const maximum = evaluation.activityCourse.activity.puntaje_maximo;
    evaluation.porcentaje = Math.min(100, Math.max(0, percentage));
    evaluation.nota_final = this.round((maximum * evaluation.porcentaje) / 100);
  }

  async remove(id_evaluacion: number): Promise<void> {
    const evaluation = await this.findOne(id_evaluacion);
    await this.evaluationRepository.remove(evaluation);
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Activity } from '../activity/entities/activity.entity';
import { Problem } from './entities/problem.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { FindProblemsQueryDto } from './dto/find-problems-query.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(dto: CreateProblemDto): Promise<Problem> {
    const activity = await this.findActivity(dto.id_actividad);
    await this.ensureScoreFits(activity, dto.puntaje);
    const { id_actividad: _id_actividad, ...problemData } = dto;
    return this.problemRepository.save(
      this.problemRepository.create({ ...problemData, activity }),
    );
  }

  async findAll(query: FindProblemsQueryDto) {
    const [data, total] = await this.problemRepository.findAndCount({
      where:
        query.id_actividad === undefined
          ? {}
          : { activity: { id_actividad: query.id_actividad } },
      relations: { activity: true },
      order: { id_problema: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_problema: number): Promise<Problem> {
    const problem = await this.problemRepository.findOne({
      where: { id_problema },
      relations: { activity: true },
    });
    if (!problem) {
      throw new NotFoundException(
        `Problema con ID ${id_problema} no encontrado`,
      );
    }
    return problem;
  }

  async update(id_problema: number, dto: UpdateProblemDto): Promise<Problem> {
    const problem = await this.findOne(id_problema);
    const { id_actividad, puntaje, ...problemData } = dto;
    const activity =
      id_actividad === undefined
        ? problem.activity
        : await this.findActivity(id_actividad);
    await this.ensureScoreFits(
      activity,
      puntaje ?? problem.puntaje,
      id_problema,
    );
    problem.activity = activity;
    Object.assign(problem, problemData);
    if (puntaje !== undefined) {
      problem.puntaje = puntaje;
    }
    return this.problemRepository.save(problem);
  }

  async remove(id_problema: number): Promise<void> {
    const problem = await this.findOne(id_problema);
    await this.problemRepository.remove(problem);
  }

  private async findActivity(id_actividad: number): Promise<Activity> {
    const activity = await this.activityRepository.findOneBy({ id_actividad });
    if (!activity) {
      throw new NotFoundException(
        `Actividad con ID ${id_actividad} no encontrada`,
      );
    }
    return activity;
  }

  private async ensureScoreFits(
    activity: Activity,
    score: number,
    excludeId?: number,
  ): Promise<void> {
    const query = this.problemRepository
      .createQueryBuilder('problem')
      .innerJoin('problem.activity', 'activity')
      .select('COALESCE(SUM(problem.puntaje), 0)', 'total')
      .where('activity.id_actividad = :id_actividad', {
        id_actividad: activity.id_actividad,
      });
    if (excludeId !== undefined) {
      query.andWhere('problem.id_problema != :excludeId', { excludeId });
    }
    const result = await query.getRawOne<{ total: string | number }>();
    if (Number(result?.total ?? 0) + score > activity.puntaje_maximo) {
      throw new BadRequestException(
        'La suma de los puntajes de los problemas no puede superar el puntaje máximo de la actividad',
      );
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ActivityLevel } from '../activity-level/entities/activity-level.entity';
import { Problem } from '../problem/entities/problem.entity';
import { Rubric } from '../rubric/entities/rubric.entity';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FindActivitiesQueryDto } from './dto/find-activities-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(ActivityLevel)
    private readonly levelRepository: Repository<ActivityLevel>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Rubric)
    private readonly rubricRepository: Repository<Rubric>,
  ) {}

  async create(dto: CreateActivityDto): Promise<Activity> {
    const { id_niveles, id_rubrica, ...activityData } = dto;
    const levels = id_niveles ? await this.findLevels(id_niveles) : [];
    const rubric =
      id_rubrica === undefined || id_rubrica === null
        ? null
        : await this.findRubric(id_rubrica);
    return this.activityRepository.save(
      this.activityRepository.create({ ...activityData, levels, rubric }),
    );
  }

  async findAll(query: FindActivitiesQueryDto) {
    const [data, total] = await this.activityRepository.findAndCount({
      where: {
        ...(query.tipo === undefined ? {} : { tipo: query.tipo }),
        ...(query.dificultad === undefined
          ? {}
          : { dificultad: query.dificultad }),
        ...(query.estado === undefined ? {} : { estado: query.estado }),
      },
      relations: { levels: true, rubric: true },
      order: { id_actividad: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_actividad: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id_actividad },
      relations: { levels: true, rubric: true },
    });
    if (!activity) {
      throw new NotFoundException(
        `Actividad con ID ${id_actividad} no encontrada`,
      );
    }
    return activity;
  }

  async update(
    id_actividad: number,
    dto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id_actividad);
    const { id_niveles, id_rubrica, puntaje_maximo, ...activityData } = dto;
    const nextMaximum = puntaje_maximo ?? activity.puntaje_maximo;
    const allocatedScore = await this.sumProblemScores(id_actividad);
    if (allocatedScore > nextMaximum) {
      throw new BadRequestException(
        'El puntaje máximo no puede ser inferior a la suma de los puntajes de sus problemas',
      );
    }
    if (id_niveles !== undefined) {
      activity.levels = await this.findLevels(id_niveles);
    }
    if (id_rubrica !== undefined) {
      activity.rubric =
        id_rubrica === null ? null : await this.findRubric(id_rubrica);
    }
    Object.assign(activity, activityData);
    if (puntaje_maximo !== undefined) {
      activity.puntaje_maximo = puntaje_maximo;
    }
    return this.activityRepository.save(activity);
  }

  async remove(id_actividad: number): Promise<void> {
    const activity = await this.findOne(id_actividad);
    await this.activityRepository.remove(activity);
  }

  private async findLevels(ids: number[]): Promise<ActivityLevel[]> {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length !== ids.length) {
      throw new BadRequestException('No se permiten niveles duplicados');
    }
    if (!uniqueIds.length) {
      return [];
    }
    const levels = await this.levelRepository
      .createQueryBuilder('level')
      .where('level.id_nivel IN (:...ids)', { ids: uniqueIds })
      .getMany();
    if (levels.length !== uniqueIds.length) {
      const found = new Set(levels.map((level) => level.id_nivel));
      const missing = uniqueIds.filter((id) => !found.has(id));
      throw new NotFoundException(
        `Niveles no encontrados: ${missing.join(', ')}`,
      );
    }
    return levels;
  }

  private async sumProblemScores(id_actividad: number): Promise<number> {
    const result = await this.problemRepository
      .createQueryBuilder('problem')
      .innerJoin('problem.activity', 'activity')
      .select('COALESCE(SUM(problem.puntaje), 0)', 'total')
      .where('activity.id_actividad = :id_actividad', { id_actividad })
      .getRawOne<{ total: string | number }>();
    return Number(result?.total ?? 0);
  }

  private async findRubric(id_rubrica: number): Promise<Rubric> {
    const rubric = await this.rubricRepository.findOneBy({ id_rubrica });
    if (!rubric) {
      throw new NotFoundException(`Rúbrica con ID ${id_rubrica} no encontrada`);
    }
    return rubric;
  }
}

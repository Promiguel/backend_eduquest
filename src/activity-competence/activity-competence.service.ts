import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Activity } from '../activity/entities/activity.entity';
import { Competence } from '../competence/entities/competence.entity';
import { ActivityCompetence } from './entities/activity-competence.entity';
import { CreateActivityCompetenceDto } from './dto/create-activity-competence.dto';
import { FindActivityCompetencesQueryDto } from './dto/find-activity-competences-query.dto';
import { UpdateActivityCompetenceDto } from './dto/update-activity-competence.dto';

@Injectable()
export class ActivityCompetenceService {
  constructor(
    @InjectRepository(ActivityCompetence)
    private readonly associationRepository: Repository<ActivityCompetence>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Competence)
    private readonly competenceRepository: Repository<Competence>,
  ) {}

  async create(dto: CreateActivityCompetenceDto): Promise<ActivityCompetence> {
    const existing = await this.associationRepository.findOneBy({
      id_actividad: dto.id_actividad,
      id_competencia: dto.id_competencia,
    });
    if (existing) {
      throw new ConflictException(
        'La competencia ya está asociada a esta actividad',
      );
    }
    const [activity, competence] = await Promise.all([
      this.findActivity(dto.id_actividad),
      this.findCompetence(dto.id_competencia),
    ]);
    const { id_actividad, id_competencia, peso } = dto;
    return this.associationRepository.save(
      this.associationRepository.create({
        id_actividad,
        id_competencia,
        peso,
        activity,
        competence,
      }),
    );
  }

  async findAll(query: FindActivityCompetencesQueryDto) {
    const where = {
      ...(query.id_actividad === undefined
        ? {}
        : { id_actividad: query.id_actividad }),
      ...(query.id_competencia === undefined
        ? {}
        : { id_competencia: query.id_competencia }),
    };
    const [data, total] = await this.associationRepository.findAndCount({
      where,
      relations: { activity: true, competence: true },
      order: { id_actividad: 'ASC', id_competencia: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findByCompetence(
    id_competencia: number,
    query: FindActivityCompetencesQueryDto,
  ) {
    await this.findCompetence(id_competencia);
    return this.findAll({
      page: query.page,
      limit: query.limit,
      id_actividad: query.id_actividad,
      id_competencia,
    });
  }

  async findOne(
    id_actividad: number,
    id_competencia: number,
  ): Promise<ActivityCompetence> {
    const association = await this.associationRepository.findOne({
      where: { id_actividad, id_competencia },
      relations: { activity: true, competence: true },
    });
    if (!association) {
      throw new NotFoundException(
        `La actividad ${id_actividad} no está asociada a la competencia ${id_competencia}`,
      );
    }
    return association;
  }

  async update(
    id_actividad: number,
    id_competencia: number,
    dto: UpdateActivityCompetenceDto,
  ): Promise<ActivityCompetence> {
    const association = await this.findOne(id_actividad, id_competencia);
    if (dto.peso !== undefined) {
      association.peso = dto.peso;
    }
    return this.associationRepository.save(association);
  }

  async remove(id_actividad: number, id_competencia: number): Promise<void> {
    const association = await this.findOne(id_actividad, id_competencia);
    await this.associationRepository.remove(association);
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

  private async findCompetence(id_competencia: number): Promise<Competence> {
    const competence = await this.competenceRepository.findOneBy({
      id_competencia,
    });
    if (!competence) {
      throw new NotFoundException(
        `Competencia con ID ${id_competencia} no encontrada`,
      );
    }
    return competence;
  }
}

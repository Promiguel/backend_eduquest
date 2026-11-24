import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ActivityLevel } from './entities/activity-level.entity';
import { CreateActivityLevelDto } from './dto/create-activity-level.dto';
import { FindActivityLevelsQueryDto } from './dto/find-activity-levels-query.dto';
import { UpdateActivityLevelDto } from './dto/update-activity-level.dto';

@Injectable()
export class ActivityLevelService {
  constructor(
    @InjectRepository(ActivityLevel)
    private readonly levelRepository: Repository<ActivityLevel>,
  ) {}

  async create(dto: CreateActivityLevelDto): Promise<ActivityLevel> {
    return this.levelRepository.save(this.levelRepository.create(dto));
  }

  async findAll(query: FindActivityLevelsQueryDto) {
    const [data, total] = await this.levelRepository.findAndCount({
      order: { orden: 'ASC', id_nivel: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_nivel: number): Promise<ActivityLevel> {
    const level = await this.levelRepository.findOneBy({ id_nivel });
    if (!level) {
      throw new NotFoundException(`Nivel con ID ${id_nivel} no encontrado`);
    }
    return level;
  }

  async update(
    id_nivel: number,
    dto: UpdateActivityLevelDto,
  ): Promise<ActivityLevel> {
    const level = await this.findOne(id_nivel);
    Object.assign(level, dto);
    return this.levelRepository.save(level);
  }

  async remove(id_nivel: number): Promise<void> {
    const level = await this.findOne(id_nivel);
    const assignedActivities = await this.levelRepository
      .createQueryBuilder('level')
      .innerJoin('level.activities', 'activity')
      .where('level.id_nivel = :id_nivel', { id_nivel })
      .getCount();
    if (assignedActivities > 0) {
      throw new ConflictException(
        'No se puede eliminar un nivel asociado a actividades',
      );
    }
    await this.levelRepository.remove(level);
  }
}

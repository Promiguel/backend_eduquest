import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { UserStory } from '../user-story/entities/user-story.entity';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { FindUserStoriesQueryDto } from '../user-story/dto/find-user-stories-query.dto';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { FindSprintsQueryDto } from './dto/find-sprints-query.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(UserStory)
    private readonly storyRepository: Repository<UserStory>,
    @InjectRepository(ScrumTask)
    private readonly taskRepository: Repository<ScrumTask>,
  ) {}

  async create(dto: CreateSprintDto): Promise<Sprint> {
    this.validateDates(dto.fecha_inicio, dto.fecha_fin);
    return this.sprintRepository.save(
      this.sprintRepository.create({
        nombre: dto.nombre,
        objetivo: dto.objetivo,
        fecha_inicio: new Date(dto.fecha_inicio),
        fecha_fin: new Date(dto.fecha_fin),
        estado: dto.estado,
      }),
    );
  }

  async findAll(query: FindSprintsQueryDto) {
    const where: FindOptionsWhere<Sprint> = {};
    if (query.estado !== undefined) {
      where.estado = query.estado;
    }
    const [data, total] = await this.sprintRepository.findAndCount({
      where,
      order: { fecha_inicio: 'DESC', id_sprint: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_sprint: number): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({
      where: { id_sprint },
    });
    if (!sprint) {
      throw new NotFoundException(`Sprint con ID ${id_sprint} no encontrado`);
    }
    return sprint;
  }

  async findStories(
    id_sprint: number,
    query: FindUserStoriesQueryDto,
  ) {
    await this.findOne(id_sprint);
    const where: FindOptionsWhere<UserStory> = {
      sprint: { id_sprint },
    };
    if (query.estado !== undefined) {
      where.estado = query.estado;
    }
    if (query.prioridad !== undefined) {
      where.prioridad = query.prioridad;
    }
    const [data, total] = await this.storyRepository.findAndCount({
      where,
      relations: { tasks: true },
      order: { id_historia: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async update(id_sprint: number, dto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id_sprint);
    const fecha_inicio = dto.fecha_inicio ?? sprint.fecha_inicio;
    const fecha_fin = dto.fecha_fin ?? sprint.fecha_fin;
    this.validateDates(fecha_inicio, fecha_fin);
    if (dto.nombre !== undefined) sprint.nombre = dto.nombre;
    if (dto.objetivo !== undefined) sprint.objetivo = dto.objetivo;
    if (dto.fecha_inicio !== undefined) {
      sprint.fecha_inicio = new Date(dto.fecha_inicio);
    }
    if (dto.fecha_fin !== undefined) sprint.fecha_fin = new Date(dto.fecha_fin);
    if (dto.estado !== undefined) sprint.estado = dto.estado;
    return this.sprintRepository.save(sprint);
  }

  async remove(id_sprint: number): Promise<void> {
    const sprint = await this.findOne(id_sprint);
    const [stories, tasks] = await Promise.all([
      this.storyRepository.count({ where: { sprint: { id_sprint } } }),
      this.taskRepository.count({ where: { sprint: { id_sprint } } }),
    ]);
    if (stories > 0 || tasks > 0) {
      throw new ConflictException(
        'No se puede eliminar el Sprint mientras tenga historias o tareas asociadas',
      );
    }
    await this.sprintRepository.remove(sprint);
  }

  private validateDates(
    fecha_inicio: string | Date,
    fecha_fin: string | Date,
  ): void {
    if (new Date(fecha_inicio).getTime() >= new Date(fecha_fin).getTime()) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de finalización',
      );
    }
  }
}

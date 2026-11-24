import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ScrumTask } from '../scrum-task/entities/scrum-task.entity';
import { Sprint } from '../sprint/entities/sprint.entity';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { FindUserStoriesQueryDto } from './dto/find-user-stories-query.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStory } from './entities/user-story.entity';

@Injectable()
export class UserStoryService {
  constructor(
    @InjectRepository(UserStory)
    private readonly storyRepository: Repository<UserStory>,
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(ScrumTask)
    private readonly taskRepository: Repository<ScrumTask>,
  ) {}

  async create(dto: CreateUserStoryDto): Promise<UserStory> {
    const sprint = await this.findSprint(dto.id_sprint);
    return this.storyRepository.save(
      this.storyRepository.create({
        codigo: dto.codigo,
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
        criterios_aceptacion: dto.criterios_aceptacion,
        estado: dto.estado,
        sprint,
      }),
    );
  }

  async findAll(query: FindUserStoriesQueryDto) {
    const where: FindOptionsWhere<UserStory> = {};
    if (query.id_sprint !== undefined) {
      where.sprint = { id_sprint: query.id_sprint };
    }
    if (query.estado !== undefined) where.estado = query.estado;
    if (query.prioridad !== undefined) where.prioridad = query.prioridad;
    const [data, total] = await this.storyRepository.findAndCount({
      where,
      relations: { sprint: true },
      order: { id_historia: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_historia: number): Promise<UserStory> {
    const story = await this.storyRepository.findOne({
      where: { id_historia },
      relations: { sprint: true, tasks: { responsible: true } },
    });
    if (!story) {
      throw new NotFoundException(
        `Historia de usuario con ID ${id_historia} no encontrada`,
      );
    }
    return story;
  }

  async findTasks(id_historia: number) {
    await this.findOne(id_historia);
    return this.taskRepository.find({
      where: { story: { id_historia } },
      relations: { sprint: true, responsible: true },
      order: { id_tarea: 'ASC' },
    });
  }

  async update(
    id_historia: number,
    dto: UpdateUserStoryDto,
  ): Promise<UserStory> {
    return this.storyRepository.manager.transaction(async (manager) => {
      const stories = manager.getRepository(UserStory);
      const story = await stories.findOne({
        where: { id_historia },
        relations: { sprint: true },
        lock: { mode: 'pessimistic_write' },
      });
      if (!story) {
        throw new NotFoundException(
          `Historia de usuario con ID ${id_historia} no encontrada`,
        );
      }
      if (dto.id_sprint !== undefined) {
        const sprint = await manager
          .getRepository(Sprint)
          .findOneBy({ id_sprint: dto.id_sprint });
        if (!sprint) {
          throw new NotFoundException(
            `Sprint con ID ${dto.id_sprint} no encontrado`,
          );
        }
        if (sprint.id_sprint !== story.sprint.id_sprint) {
          const tasks = await manager.getRepository(ScrumTask).find({
            where: { story: { id_historia } },
          });
          tasks.forEach((task) => {
            task.sprint = sprint;
          });
          if (tasks.length > 0) {
            await manager.getRepository(ScrumTask).save(tasks);
          }
          story.sprint = sprint;
        }
      }
      if (dto.codigo !== undefined) story.codigo = dto.codigo;
      if (dto.descripcion !== undefined) story.descripcion = dto.descripcion;
      if (dto.prioridad !== undefined) story.prioridad = dto.prioridad;
      if (dto.criterios_aceptacion !== undefined) {
        story.criterios_aceptacion = dto.criterios_aceptacion;
      }
      if (dto.estado !== undefined) story.estado = dto.estado;
      return stories.save(story);
    });
  }

  async remove(id_historia: number): Promise<void> {
    const story = await this.findOne(id_historia);
    const taskCount = await this.taskRepository.count({
      where: { story: { id_historia } },
    });
    if (taskCount > 0) {
      throw new ConflictException(
        'No se puede eliminar la historia mientras tenga tareas asociadas',
      );
    }
    await this.storyRepository.remove(story);
  }

  private async findSprint(id_sprint: number): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOneBy({ id_sprint });
    if (!sprint) {
      throw new NotFoundException(`Sprint con ID ${id_sprint} no encontrado`);
    }
    return sprint;
  }
}

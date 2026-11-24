import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Sprint } from '../sprint/entities/sprint.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { User } from '../user/entities/user.entity';
import { CreateScrumTaskDto } from './dto/create-scrum-task.dto';
import { FindScrumTasksQueryDto } from './dto/find-scrum-tasks-query.dto';
import { UpdateScrumTaskDto } from './dto/update-scrum-task.dto';
import { ScrumTask } from './entities/scrum-task.entity';

@Injectable()
export class ScrumTaskService {
  constructor(
    @InjectRepository(ScrumTask)
    private readonly taskRepository: Repository<ScrumTask>,
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(UserStory)
    private readonly storyRepository: Repository<UserStory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateScrumTaskDto): Promise<ScrumTask> {
    const [sprint, story, responsible] = await Promise.all([
      this.findSprint(dto.id_sprint),
      this.findStory(dto.id_historia),
      dto.id_responsable == null
        ? Promise.resolve(null)
        : this.findResponsible(dto.id_responsable),
    ]);
    this.validateStorySprint(story, sprint);
    return this.taskRepository.save(
      this.taskRepository.create({
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        estado: dto.estado,
        prioridad: dto.prioridad,
        estimacion_horas: dto.estimacion_horas,
        fecha_cierre:
          dto.fecha_cierre == null ? null : new Date(dto.fecha_cierre),
        story,
        sprint,
        responsible,
      }),
    );
  }

  async findAll(query: FindScrumTasksQueryDto) {
    const where: FindOptionsWhere<ScrumTask> = {};
    if (query.id_responsable !== undefined) {
      where.responsible = { id_usuario: query.id_responsable };
    }
    if (query.id_sprint !== undefined) {
      where.sprint = { id_sprint: query.id_sprint };
    }
    if (query.id_historia !== undefined) {
      where.story = { id_historia: query.id_historia };
    }
    if (query.estado !== undefined) where.estado = query.estado;
    if (query.prioridad !== undefined) where.prioridad = query.prioridad;
    const [data, total] = await this.taskRepository.findAndCount({
      where,
      relations: {
        sprint: true,
        story: true,
        responsible: true,
      },
      order: { id_tarea: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_tarea: number): Promise<ScrumTask> {
    const task = await this.taskRepository.findOne({
      where: { id_tarea },
      relations: {
        sprint: true,
        story: true,
        responsible: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id_tarea} no encontrada`);
    }
    return task;
  }

  async update(
    id_tarea: number,
    dto: UpdateScrumTaskDto,
  ): Promise<ScrumTask> {
    const task = await this.findOne(id_tarea);
    const story = await this.findStory(
      dto.id_historia === undefined
        ? task.story.id_historia
        : dto.id_historia,
    );
    const sprint =
      dto.id_sprint === undefined
        ? dto.id_historia === undefined
          ? task.sprint
          : story.sprint
        : await this.findSprint(dto.id_sprint);
    this.validateStorySprint(story, sprint);

    if (dto.id_responsable !== undefined) {
      task.responsible =
        dto.id_responsable === null
          ? null
          : await this.findResponsible(dto.id_responsable);
    }
    task.story = story;
    task.sprint = sprint;
    if (dto.titulo !== undefined) task.titulo = dto.titulo;
    if (dto.descripcion !== undefined) task.descripcion = dto.descripcion;
    if (dto.estado !== undefined) task.estado = dto.estado;
    if (dto.prioridad !== undefined) task.prioridad = dto.prioridad;
    if (dto.estimacion_horas !== undefined) {
      task.estimacion_horas = dto.estimacion_horas;
    }
    if (dto.fecha_cierre !== undefined) {
      task.fecha_cierre =
        dto.fecha_cierre === null ? null : new Date(dto.fecha_cierre);
    }
    return this.taskRepository.save(task);
  }

  async remove(id_tarea: number): Promise<void> {
    const task = await this.findOne(id_tarea);
    await this.taskRepository.remove(task);
  }

  private async findSprint(id_sprint: number): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOneBy({ id_sprint });
    if (!sprint) {
      throw new NotFoundException(`Sprint con ID ${id_sprint} no encontrado`);
    }
    return sprint;
  }

  private async findStory(id_historia: number): Promise<UserStory> {
    const story = await this.storyRepository.findOne({
      where: { id_historia },
      relations: { sprint: true },
    });
    if (!story) {
      throw new NotFoundException(
        `Historia de usuario con ID ${id_historia} no encontrada`,
      );
    }
    return story;
  }

  private async findResponsible(id_usuario: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id_usuario });
    if (!user) {
      throw new NotFoundException(
        `Usuario responsable con ID ${id_usuario} no encontrado`,
      );
    }
    return user;
  }

  private validateStorySprint(story: UserStory, sprint: Sprint): void {
    if (story.sprint.id_sprint !== sprint.id_sprint) {
      throw new BadRequestException(
        'La historia de usuario y la tarea deben pertenecer al mismo Sprint',
      );
    }
  }
}

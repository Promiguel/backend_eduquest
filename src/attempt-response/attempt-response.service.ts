import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { AnswerOption } from '../answer-option/entities/answer-option.entity';
import { Problem } from '../problem/entities/problem.entity';
import { ActivityAttempt } from '../activity-attempt/entities/activity-attempt.entity';
import { ActivityAttemptService } from '../activity-attempt/activity-attempt.service';
import { AttemptResponse } from './entities/attempt-response.entity';
import { CreateAttemptResponseDto } from './dto/create-attempt-response.dto';
import { FindAttemptResponsesQueryDto } from './dto/find-attempt-responses-query.dto';

@Injectable()
export class AttemptResponseService {
  constructor(
    @InjectRepository(AttemptResponse)
    private readonly responseRepository: Repository<AttemptResponse>,
    @InjectRepository(ActivityAttempt)
    private readonly attemptRepository: Repository<ActivityAttempt>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(AnswerOption)
    private readonly optionRepository: Repository<AnswerOption>,
    private readonly attemptService: ActivityAttemptService,
  ) {}

  async create(
    id_intento: number,
    dto: CreateAttemptResponseDto,
  ): Promise<AttemptResponse> {
    const attempt = await this.attemptRepository.findOne({
      where: { id_intento },
      relations: { activityCourse: { activity: true } },
    });
    if (!attempt) {
      throw new NotFoundException(`Intento con ID ${id_intento} no encontrado`);
    }
    if (attempt.estado !== 'en_progreso') {
      throw new BadRequestException(
        'No se pueden registrar respuestas en un intento finalizado',
      );
    }
    const problem = await this.problemRepository.findOne({
      where: { id_problema: dto.id_problema },
      relations: { activity: true },
    });
    if (!problem) {
      throw new NotFoundException(
        `Problema con ID ${dto.id_problema} no encontrado`,
      );
    }
    if (
      problem.activity.id_actividad !==
      attempt.activityCourse.activity.id_actividad
    ) {
      throw new BadRequestException(
        'El problema no pertenece a la actividad del intento',
      );
    }
    const responseText = dto.respuesta_texto?.trim();
    if (dto.id_opcion !== undefined && responseText) {
      throw new BadRequestException(
        'Envía una opción o una respuesta de texto, no ambas',
      );
    }
    if (dto.id_opcion === undefined && !responseText) {
      throw new BadRequestException(
        'Debes proporcionar una opción o una respuesta de texto',
      );
    }

    let option: AnswerOption | null = null;
    let isCorrect = false;
    let score = 0;
    if (dto.id_opcion !== undefined) {
      option = await this.optionRepository.findOne({
        where: { id_opcion: dto.id_opcion },
        relations: { problem: true },
      });
      if (!option) {
        throw new NotFoundException(
          `Opción de respuesta con ID ${dto.id_opcion} no encontrada`,
        );
      }
      if (option.problem.id_problema !== problem.id_problema) {
        throw new BadRequestException(
          'La opción de respuesta no pertenece al problema indicado',
        );
      }
      isCorrect = option.es_correcta;
      score = isCorrect ? problem.puntaje : 0;
    }

    const existing = await this.responseRepository.findOne({
      where: {
        attempt: { id_intento },
        problem: { id_problema: problem.id_problema },
      },
    });
    const response =
      existing ?? this.responseRepository.create({ attempt, problem });
    response.attempt = attempt;
    response.problem = problem;
    response.option = option;
    response.respuesta_texto = responseText;
    response.es_correcta = isCorrect;
    response.puntaje_obtenido = score;
    response.retroalimentacion = problem.retroalimentacion_auto;
    const saved = await this.responseRepository.save(response);
    await this.attemptService.recalculateScore(id_intento);
    return saved;
  }

  async findAll(query: FindAttemptResponsesQueryDto) {
    const [data, total] = await this.responseRepository.findAndCount({
      where:
        query.id_intento === undefined
          ? {}
          : { attempt: { id_intento: query.id_intento } },
      relations: { attempt: true, problem: true, option: true },
      order: { id_respuesta: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_respuesta: number): Promise<AttemptResponse> {
    const response = await this.responseRepository.findOne({
      where: { id_respuesta },
      relations: { attempt: true, problem: true, option: true },
    });
    if (!response) {
      throw new NotFoundException(
        `Respuesta con ID ${id_respuesta} no encontrada`,
      );
    }
    return response;
  }

  async remove(id_respuesta: number): Promise<void> {
    const response = await this.findOne(id_respuesta);
    if (response.attempt.estado !== 'en_progreso') {
      throw new BadRequestException(
        'No se pueden eliminar respuestas de un intento finalizado',
      );
    }
    await this.responseRepository.remove(response);
    await this.attemptService.recalculateScore(response.attempt.id_intento);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Problem } from '../problem/entities/problem.entity';
import { AnswerOption } from './entities/answer-option.entity';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { FindAnswerOptionsQueryDto } from './dto/find-answer-options-query.dto';
import { UpdateAnswerOptionDto } from './dto/update-answer-option.dto';

@Injectable()
export class AnswerOptionService {
  constructor(
    @InjectRepository(AnswerOption)
    private readonly optionRepository: Repository<AnswerOption>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  async create(dto: CreateAnswerOptionDto): Promise<AnswerOption> {
    const problem = await this.findProblem(dto.id_problema);
    const { id_problema: _id_problema, ...optionData } = dto;
    return this.optionRepository.save(
      this.optionRepository.create({ ...optionData, problem }),
    );
  }

  async findAll(query: FindAnswerOptionsQueryDto) {
    const [data, total] = await this.optionRepository.findAndCount({
      where:
        query.id_problema === undefined
          ? {}
          : { problem: { id_problema: query.id_problema } },
      relations: { problem: true },
      order: { orden: 'ASC', id_opcion: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_opcion: number): Promise<AnswerOption> {
    const option = await this.optionRepository.findOne({
      where: { id_opcion },
      relations: { problem: true },
    });
    if (!option) {
      throw new NotFoundException(
        `Opción de respuesta con ID ${id_opcion} no encontrada`,
      );
    }
    return option;
  }

  async update(
    id_opcion: number,
    dto: UpdateAnswerOptionDto,
  ): Promise<AnswerOption> {
    const option = await this.findOne(id_opcion);
    const { id_problema, ...optionData } = dto;
    if (id_problema !== undefined) {
      option.problem = await this.findProblem(id_problema);
    }
    Object.assign(option, optionData);
    return this.optionRepository.save(option);
  }

  async remove(id_opcion: number): Promise<void> {
    const option = await this.findOne(id_opcion);
    await this.optionRepository.remove(option);
  }

  private async findProblem(id_problema: number): Promise<Problem> {
    const problem = await this.problemRepository.findOneBy({ id_problema });
    if (!problem) {
      throw new NotFoundException(
        `Problema con ID ${id_problema} no encontrado`,
      );
    }
    return problem;
  }
}

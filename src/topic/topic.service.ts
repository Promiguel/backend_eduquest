import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { ThematicUnit } from '../thematic-unit/entities/thematic-unit.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { FindTopicsQueryDto } from './dto/find-topics-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(ThematicUnit)
    private readonly unitRepository: Repository<ThematicUnit>,
  ) {}

  async create(dto: CreateTopicDto): Promise<Topic> {
    const thematicUnit = await this.findThematicUnit(dto.id_unidad);
    const { id_unidad: _id_unidad, ...topicData } = dto;
    return this.topicRepository.save(
      this.topicRepository.create({ ...topicData, thematicUnit }),
    );
  }

  async findAll(query: FindTopicsQueryDto) {
    const where: FindOptionsWhere<Topic> = {};
    if (query.id_unidad !== undefined) {
      where.thematicUnit = { id_unidad: query.id_unidad };
    }

    const [data, total] = await this.topicRepository.findAndCount({
      where,
      relations: { thematicUnit: true },
      order: { id_tema: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_tema: number): Promise<Topic> {
    const topic = await this.topicRepository.findOne({
      where: { id_tema },
      relations: { thematicUnit: true },
    });
    if (!topic) {
      throw new NotFoundException(`Tema con ID ${id_tema} no encontrado`);
    }
    return topic;
  }

  async update(id_tema: number, dto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.findOne(id_tema);
    const { id_unidad, ...topicData } = dto;
    if (id_unidad !== undefined) {
      topic.thematicUnit = await this.findThematicUnit(id_unidad);
    }
    Object.assign(topic, topicData);
    return this.topicRepository.save(topic);
  }

  async remove(id_tema: number): Promise<void> {
    const topic = await this.findOne(id_tema);
    await this.topicRepository.remove(topic);
  }

  private async findThematicUnit(id_unidad: number): Promise<ThematicUnit> {
    const unit = await this.unitRepository.findOneBy({ id_unidad });
    if (!unit) {
      throw new NotFoundException(
        `Unidad temática con ID ${id_unidad} no encontrada`,
      );
    }
    return unit;
  }
}

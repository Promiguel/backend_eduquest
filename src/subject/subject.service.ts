import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { FindSubjectsQueryDto } from './dto/find-subjects-query.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(dto: CreateSubjectDto): Promise<Subject> {
    return this.subjectRepository.save(this.subjectRepository.create(dto));
  }

  async findAll(query: FindSubjectsQueryDto) {
    const [data, total] = await this.subjectRepository.findAndCount({
      where: query.area === undefined ? {} : { area: query.area },
      order: { id_asignatura: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_asignatura: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOneBy({ id_asignatura });
    if (!subject) {
      throw new NotFoundException(
        `Asignatura con ID ${id_asignatura} no encontrada`,
      );
    }
    return subject;
  }

  async update(
    id_asignatura: number,
    dto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id_asignatura);
    Object.assign(subject, dto);
    return this.subjectRepository.save(subject);
  }

  async remove(id_asignatura: number): Promise<void> {
    const subject = await this.findOne(id_asignatura);
    await this.subjectRepository.remove(subject);
  }
}

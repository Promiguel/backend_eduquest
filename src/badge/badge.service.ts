import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { Badge, BadgeCriterion } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { FindBadgesQueryDto } from './dto/find-badges-query.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Competence } from '../competence/entities/competence.entity';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @InjectRepository(Competence)
    private readonly competenceRepository: Repository<Competence>,
  ) {}

  async create(dto: CreateBadgeDto): Promise<Badge> {
    const criterion = await this.validateCriterion(dto.criterio_obtencion);
    return this.badgeRepository.save(
      this.badgeRepository.create({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        imagen_url: dto.imagen_url,
        tipo: dto.tipo,
        puntos_asociados: dto.puntos_asociados,
        criterio_obtencion: criterion,
      }),
    );
  }

  async findAll(query: FindBadgesQueryDto) {
    const [data, total] = await this.badgeRepository.findAndCount({
      order: { id_insignia: 'ASC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_insignia: number): Promise<Badge> {
    const badge = await this.badgeRepository.findOneBy({ id_insignia });
    if (!badge) {
      throw new NotFoundException(
        `Insignia con ID ${id_insignia} no encontrada`,
      );
    }
    return badge;
  }

  async update(id_insignia: number, dto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.findOne(id_insignia);
    if (dto.criterio_obtencion !== undefined) {
      badge.criterio_obtencion = await this.validateCriterion(
        dto.criterio_obtencion,
      );
    }
    const { criterio_obtencion: _criterion, ...data } = dto;
    Object.assign(badge, data);
    return this.badgeRepository.save(badge);
  }

  async remove(id_insignia: number): Promise<void> {
    const badge = await this.findOne(id_insignia);
    await this.badgeRepository.remove(badge);
  }

  private async validateCriterion(value: unknown): Promise<BadgeCriterion> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException(
        'criterio_obtencion debe ser un objeto JSON válido',
      );
    }
    const criterion = value as Record<string, unknown>;
    if (criterion.tipo === 'PUNTOS_ACUMULADOS') {
      if (
        typeof criterion.cantidad !== 'number' ||
        !Number.isInteger(criterion.cantidad) ||
        criterion.cantidad < 1
      ) {
        throw new BadRequestException(
          'El criterio requiere una cantidad entera mayor que cero',
        );
      }
      return {
        tipo: 'PUNTOS_ACUMULADOS',
        cantidad: criterion.cantidad,
      };
    }
    if (criterion.tipo === 'ACTIVIDADES_COMPLETADAS') {
      if (
        typeof criterion.cantidad !== 'number' ||
        !Number.isInteger(criterion.cantidad) ||
        criterion.cantidad < 1
      ) {
        throw new BadRequestException(
          'El criterio requiere una cantidad entera mayor que cero',
        );
      }
      return {
        tipo: 'ACTIVIDADES_COMPLETADAS',
        cantidad: criterion.cantidad,
      };
    }
    if (criterion.tipo === 'COMPETENCIA_NIVEL') {
      if (
        typeof criterion.nivel !== 'number' ||
        !Number.isInteger(criterion.nivel) ||
        criterion.nivel < 1 ||
        typeof criterion.id_competencia !== 'number' ||
        !Number.isInteger(criterion.id_competencia) ||
        criterion.id_competencia < 1
      ) {
        throw new BadRequestException(
          'El criterio COMPETENCIA_NIVEL requiere nivel e id_competencia válidos',
        );
      }
      if (
        !(await this.competenceRepository.findOneBy({
          id_competencia: criterion.id_competencia,
        }))
      ) {
        throw new NotFoundException(
          `Competencia con ID ${criterion.id_competencia} no encontrada`,
        );
      }
      return {
        tipo: 'COMPETENCIA_NIVEL',
        nivel: criterion.nivel,
        id_competencia: criterion.id_competencia,
      };
    }
    throw new BadRequestException(
      'Tipo de criterio de insignia no soportado',
    );
  }
}

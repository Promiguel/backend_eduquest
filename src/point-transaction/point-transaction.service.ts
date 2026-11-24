import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPageResult } from '../common/pagination/page-result';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { Student } from '../student/entities/student.entity';
import { StudentBadgeService } from '../student-badge/student-badge.service';
import { PointTransaction } from './entities/point-transaction.entity';
import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { FindPointTransactionsQueryDto } from './dto/find-point-transactions-query.dto';

@Injectable()
export class PointTransactionService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly transactionRepository: Repository<PointTransaction>,
    @InjectRepository(GamificationProfile)
    private readonly profileRepository: Repository<GamificationProfile>,
    private readonly studentBadgeService: StudentBadgeService,
  ) {}

  async create(dto: CreatePointTransactionDto): Promise<PointTransaction> {
    return this.transactionRepository.manager.transaction(async (manager) => {
      const studentRepository = manager.getRepository(Student);
      const student = await studentRepository.findOne({
        where: { id_estudiante: dto.id_estudiante },
        lock: { mode: 'pessimistic_write' },
      });
      if (!student) {
        throw new NotFoundException(
          `Estudiante con ID ${dto.id_estudiante} no encontrado`,
        );
      }
      const profiles = manager.getRepository(GamificationProfile);
      let profile = await profiles.findOne({
        where: { student: { id_estudiante: dto.id_estudiante } },
        lock: { mode: 'pessimistic_write' },
      });
      if (!profile) {
        profile = await profiles.save(
          profiles.create({
            student,
            nivel: 1,
            nivel_actual: 1,
            puntos_totales: 0,
          }),
        );
      }

      const amount =
        dto.tipo_transaccion === 'SUMA' ? dto.monto : -dto.monto;
      const nextPoints = profile.puntos_totales + amount;
      if (nextPoints < 0) {
        throw new BadRequestException(
          'La transacción no puede dejar los puntos totales en negativo',
        );
      }
      profile.puntos_totales = nextPoints;
      profile.nivel = this.calculateLevel(nextPoints);
      profile.nivel_actual = profile.nivel;
      await profiles.save(profile);

      const transactionRepository = manager.getRepository(PointTransaction);
      const transaction = await transactionRepository.save(
        transactionRepository.create({
          profile,
          tipo_transaccion: dto.tipo_transaccion,
          monto: dto.monto,
          descripcion: dto.descripcion,
        }),
      );
      await this.studentBadgeService.evaluateEligible(
        manager,
        dto.id_estudiante,
      );
      return transaction;
    });
  }

  async findAll(query: FindPointTransactionsQueryDto) {
    const profileWhere = {
      ...(query.id_perfil === undefined ? {} : { id_perfil: query.id_perfil }),
      ...(query.id_estudiante === undefined
        ? {}
        : { student: { id_estudiante: query.id_estudiante } }),
    };
    const [data, total] = await this.transactionRepository.findAndCount({
      where: { profile: profileWhere },
      relations: { profile: { student: true } },
      order: { fecha: 'DESC', id_transaccion: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return createPageResult(data, total, query.page, query.limit);
  }

  async findOne(id_transaccion: number): Promise<PointTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id_transaccion },
      relations: { profile: { student: true } },
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transacción con ID ${id_transaccion} no encontrada`,
      );
    }
    return transaction;
  }

  private calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationProfileModule } from '../gamification-profile/gamification-profile.module';
import { StudentBadgeModule } from '../student-badge/student-badge.module';
import { GamificationProfile } from '../gamification-profile/entities/gamification-profile.entity';
import { PointTransactionController } from './point-transaction.controller';
import { PointTransactionService } from './point-transaction.service';
import { PointTransaction } from './entities/point-transaction.entity';

@Module({
  imports: [
    GamificationProfileModule,
    StudentBadgeModule,
    TypeOrmModule.forFeature([PointTransaction, GamificationProfile]),
  ],
  controllers: [PointTransactionController],
  providers: [PointTransactionService],
  exports: [PointTransactionService],
})
export class PointTransactionModule {}

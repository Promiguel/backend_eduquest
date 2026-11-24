import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { GamificationProfile } from '../../gamification-profile/entities/gamification-profile.entity';

@Entity('transacciones_puntos')
export class PointTransaction {
  @PrimaryGeneratedColumn({ name: 'id_transaccion' })
  id_transaccion: number;

  @Column({ name: 'tipo_transaccion', type: 'varchar', length: 20 })
  tipo_transaccion: string;

  @Column({ type: 'int' })
  monto: number;

  @CreateDateColumn({ type: 'datetime' })
  fecha: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @ManyToOne(() => GamificationProfile, (profile) => profile.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_perfil' })
  profile: GamificationProfile;
}

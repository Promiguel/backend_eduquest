import {
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { PointTransaction } from '../../point-transaction/entities/point-transaction.entity';

@Entity('perfiles_gamificacion')
export class GamificationProfile {
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  id_perfil: number;

  @Column({ type: 'int', default: 1 })
  nivel: number;

  @Column({ name: 'puntos_totales', type: 'int', default: 0 })
  puntos_totales: number;

  @Column({ name: 'nivel_actual', type: 'int', default: 1 })
  nivel_actual: number;

  @UpdateDateColumn({ name: 'fecha_actualizacion', type: 'datetime' })
  fecha_actualizacion: Date;

  @OneToOne(() => Student, (student) => student.gamificationProfile, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_estudiante' })
  student: Student;

  @OneToMany(
    () => PointTransaction,
    (transaction) => transaction.profile,
  )
  transactions: PointTransaction[];
}

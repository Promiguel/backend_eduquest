import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('estudiantes')
export class Student {
  @PrimaryGeneratedColumn({ name: 'id_estudiante' })
  id_estudiante: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo_estudiante?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  carrera?: string;

  @Column({ type: 'int', nullable: true })
  semestre?: number;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;
}

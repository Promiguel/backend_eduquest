import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('docentes')
export class Teacher {
  @PrimaryGeneratedColumn({ name: 'id_docente' })
  id_docente: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo_docente?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  especialidad?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  titulo?: string;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;
}

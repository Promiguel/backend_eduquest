import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Institution } from '../../institution/entities/institution.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  correo: string;

  @Column({ name: 'contrasena_hash', type: 'varchar', length: 255, select: false })
  contrasena_hash: string;

  @ManyToOne(() => Institution, (institution) => institution.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_institucion' })
  institution?: Institution;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_rol' })
  role?: Role;

  @Column({ type: 'varchar', length: 20, default: 'estudiante' })
  rol: string; // mantengo este campo para compatibilidad con la app actual

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;

  @Column({ name: 'ultimo_acceso', type: 'timestamp', nullable: true })
  ultimo_acceso: Date;
}

import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn 
} from 'typeorm';

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

  @Column({ type: 'varchar', length: 20, default: 'estudiante' })
  rol: string; // 'estudiante', 'docente', 'administrador'

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro: Date;

  @Column({ name: 'ultimo_acceso', type: 'timestamp', nullable: true })
  ultimo_acceso: Date;
}

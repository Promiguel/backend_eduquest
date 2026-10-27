import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('instituciones')
export class Institution {
  @PrimaryGeneratedColumn({ name: 'id_institucion' })
  id_institucion: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  correo?: string;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @OneToMany(() => User, (user) => user.institution)
  users: User[];
}

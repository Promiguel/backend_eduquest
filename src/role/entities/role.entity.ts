import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../user-role/entities/user-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}

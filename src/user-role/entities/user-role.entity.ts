import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity('USUARIO_ROL')
@Index('IDX_USUARIO_ROL_id_rol', ['id_rol'])
export class UserRole {
  @PrimaryColumn({ name: 'id_usuario', type: 'int' })
  id_usuario: number;

  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  id_rol: number;

  @ManyToOne(() => User, (user) => user.userRoles, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id_usuario' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id_rol' })
  role: Role;
}

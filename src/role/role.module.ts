import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserRole } from '../user-role/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

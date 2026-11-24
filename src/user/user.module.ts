import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Institution } from '../institution/entities/institution.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Institution, UserRole])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

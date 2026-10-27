import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { InstitutionModule } from './institution/institution.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Institution } from './institution/entities/institution.entity';
import { Student } from './student/entities/student.entity';
import { Teacher } from './teacher/entities/teacher.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'eduquest'),
        entities: [User, Role, Institution, Student, Teacher],
        synchronize: true,
      }),
    }),
    UserModule,
    AuthModule,
    RoleModule,
    InstitutionModule,
    StudentModule,
    TeacherModule,
  ],
})
export class AppModule {}

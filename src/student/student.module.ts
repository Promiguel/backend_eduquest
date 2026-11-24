import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { GamificationProfileModule } from '../gamification-profile/gamification-profile.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    GamificationProfileModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}

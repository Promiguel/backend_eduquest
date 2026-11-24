import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../course/entities/course.entity';
import { Student } from '../student/entities/student.entity';
import { GamificationProfileController } from './gamification-profile.controller';
import { GamificationProfileService } from './gamification-profile.service';
import { GamificationProfile } from './entities/gamification-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GamificationProfile,
      Student,
      Course,
    ]),
  ],
  controllers: [GamificationProfileController],
  providers: [GamificationProfileService],
  exports: [GamificationProfileService],
})
export class GamificationProfileModule {}

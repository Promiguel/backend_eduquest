import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GamificationProfileService } from './gamification-profile.service';
import { FindGamificationProfilesQueryDto } from './dto/find-gamification-profiles-query.dto';

@Controller('gamification-profile')
export class GamificationProfileController {
  constructor(private readonly profileService: GamificationProfileService) {}

  @Get('ranking')
  findRanking(@Query() query: FindGamificationProfilesQueryDto) {
    return this.profileService.findRanking(query);
  }

  @Get('ranking/course/:id_curso')
  findRankingByCourse(
    @Param('id_curso', ParseIntPipe) id_curso: number,
    @Query() query: FindGamificationProfilesQueryDto,
  ) {
    return this.profileService.findRankingByCourse(id_curso, query);
  }

  @Get(':id_estudiante')
  findByStudent(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
  ) {
    return this.profileService.findByStudent(id_estudiante);
  }
}

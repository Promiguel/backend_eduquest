import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { StudentBadgeService } from './student-badge.service';
import { AwardStudentBadgeDto } from './dto/award-student-badge.dto';
import { FindStudentBadgesQueryDto } from './dto/find-student-badges-query.dto';

@Controller('student-badge')
export class StudentBadgeController {
  constructor(private readonly studentBadgeService: StudentBadgeService) {}

  @Post()
  award(@Body() dto: AwardStudentBadgeDto) {
    return this.studentBadgeService.award(dto);
  }

  @Get()
  findAll(@Query() query: FindStudentBadgesQueryDto) {
    return this.studentBadgeService.findAll(query);
  }

  @Get('student/:id_estudiante')
  findByStudent(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
  ) {
    return this.studentBadgeService.findByStudent(id_estudiante);
  }
}

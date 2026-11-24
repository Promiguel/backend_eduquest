import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ActivityAttemptService } from './activity-attempt.service';
import { CreateActivityAttemptDto } from './dto/create-activity-attempt.dto';
import { FindActivityAttemptsQueryDto } from './dto/find-activity-attempts-query.dto';

@Controller('activity-attempt')
export class ActivityAttemptController {
  constructor(private readonly attemptService: ActivityAttemptService) {}

  @Post()
  create(@Body() dto: CreateActivityAttemptDto) {
    return this.attemptService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindActivityAttemptsQueryDto) {
    return this.attemptService.findAll(query);
  }

  @Get('enrollment/:id_inscripcion/history')
  findHistory(
    @Param('id_inscripcion', ParseIntPipe) id_inscripcion: number,
    @Query() query: FindActivityAttemptsQueryDto,
  ) {
    return this.attemptService.findHistoryForEnrollment(id_inscripcion, query);
  }

  @Get('results/student/:id_estudiante')
  findResultsForStudent(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
    @Query() query: FindActivityAttemptsQueryDto,
  ) {
    return this.attemptService.findResultsForStudent(id_estudiante, query);
  }

  @Get('results/activity-course/:id_actividad_curso')
  findResultsForActivityCourse(
    @Param('id_actividad_curso', ParseIntPipe) id_actividad_curso: number,
    @Query() query: FindActivityAttemptsQueryDto,
  ) {
    return this.attemptService.findResultsForActivityCourse(
      id_actividad_curso,
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attemptService.findOne(id);
  }

  @Post(':id/finish')
  finish(@Param('id', ParseIntPipe) id: number) {
    return this.attemptService.finish(id);
  }
}

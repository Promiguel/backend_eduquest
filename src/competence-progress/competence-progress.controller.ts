import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CompetenceProgressService } from './competence-progress.service';
import { CreateCompetenceProgressDto } from './dto/create-competence-progress.dto';
import { FindCompetenceProgressQueryDto } from './dto/find-competence-progress-query.dto';
import { UpdateCompetenceProgressDto } from './dto/update-competence-progress.dto';

@Controller('competence-progress')
export class CompetenceProgressController {
  constructor(
    private readonly progressService: CompetenceProgressService,
  ) {}

  @Post()
  create(@Body() dto: CreateCompetenceProgressDto) {
    return this.progressService.upsert(dto);
  }

  @Get()
  findAll(@Query() query: FindCompetenceProgressQueryDto) {
    return this.progressService.findAll(query);
  }

  @Get('student/:id_estudiante/competencies')
  findStudentCompetencies(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
    @Query() query: FindCompetenceProgressQueryDto,
  ) {
    return this.progressService.findStudentCompetencies(
      id_estudiante,
      query.id_curso,
    );
  }

  @Get('student/:id_estudiante')
  findForStudent(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
  ) {
    return this.progressService.findForStudent(id_estudiante);
  }

  @Get('course/:id_curso')
  findForCourse(@Param('id_curso', ParseIntPipe) id_curso: number) {
    return this.progressService.findForCourse(id_curso);
  }

  @Put('student/:id_estudiante/competence/:id_competencia')
  update(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
    @Param('id_competencia', ParseIntPipe) id_competencia: number,
    @Body() dto: UpdateCompetenceProgressDto,
  ) {
    return this.progressService.upsert({
      id_estudiante,
      id_competencia,
      nivel_alcanzado: dto.nivel_alcanzado,
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActivityCompetenceService } from './activity-competence.service';
import { CreateActivityCompetenceDto } from './dto/create-activity-competence.dto';
import { FindActivityCompetencesQueryDto } from './dto/find-activity-competences-query.dto';
import { UpdateActivityCompetenceDto } from './dto/update-activity-competence.dto';

@Controller('activity-competence')
export class ActivityCompetenceController {
  constructor(private readonly associationService: ActivityCompetenceService) {}

  @Post()
  create(@Body() dto: CreateActivityCompetenceDto) {
    return this.associationService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindActivityCompetencesQueryDto) {
    return this.associationService.findAll(query);
  }

  @Get('competence/:id_competencia')
  findByCompetence(
    @Param('id_competencia', ParseIntPipe) id_competencia: number,
    @Query() query: FindActivityCompetencesQueryDto,
  ) {
    return this.associationService.findByCompetence(id_competencia, query);
  }

  @Get(':id_actividad/:id_competencia')
  findOne(
    @Param('id_actividad', ParseIntPipe) id_actividad: number,
    @Param('id_competencia', ParseIntPipe) id_competencia: number,
  ) {
    return this.associationService.findOne(id_actividad, id_competencia);
  }

  @Put(':id_actividad/:id_competencia')
  update(
    @Param('id_actividad', ParseIntPipe) id_actividad: number,
    @Param('id_competencia', ParseIntPipe) id_competencia: number,
    @Body() dto: UpdateActivityCompetenceDto,
  ) {
    return this.associationService.update(id_actividad, id_competencia, dto);
  }

  @Delete(':id_actividad/:id_competencia')
  remove(
    @Param('id_actividad', ParseIntPipe) id_actividad: number,
    @Param('id_competencia', ParseIntPipe) id_competencia: number,
  ) {
    return this.associationService.remove(id_actividad, id_competencia);
  }
}

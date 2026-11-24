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
import { CreateCompetenceDto } from './dto/create-competence.dto';
import { FindCompetencesQueryDto } from './dto/find-competences-query.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { CompetenceService } from './competence.service';

@Controller('competence')
export class CompetenceController {
  constructor(private readonly competenceService: CompetenceService) {}

  @Post()
  create(@Body() dto: CreateCompetenceDto) {
    return this.competenceService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindCompetencesQueryDto) {
    return this.competenceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competenceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompetenceDto,
  ) {
    return this.competenceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competenceService.remove(id);
  }
}

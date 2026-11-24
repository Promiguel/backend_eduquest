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
import { EvaluationCriterionService } from './evaluation-criterion.service';
import { CreateEvaluationCriterionDto } from './dto/create-evaluation-criterion.dto';
import { FindEvaluationCriteriaQueryDto } from './dto/find-evaluation-criteria-query.dto';
import { UpdateEvaluationCriterionDto } from './dto/update-evaluation-criterion.dto';

@Controller('evaluation-criterion')
export class EvaluationCriterionController {
  constructor(
    private readonly evaluationCriterionService: EvaluationCriterionService,
  ) {}

  @Post()
  create(@Body() dto: CreateEvaluationCriterionDto) {
    return this.evaluationCriterionService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindEvaluationCriteriaQueryDto) {
    return this.evaluationCriterionService.findAll(query);
  }

  @Get(':id_evaluacion/:id_criterio')
  findOne(
    @Param('id_evaluacion', ParseIntPipe) id_evaluacion: number,
    @Param('id_criterio', ParseIntPipe) id_criterio: number,
  ) {
    return this.evaluationCriterionService.findOne(id_evaluacion, id_criterio);
  }

  @Put(':id_evaluacion/:id_criterio')
  update(
    @Param('id_evaluacion', ParseIntPipe) id_evaluacion: number,
    @Param('id_criterio', ParseIntPipe) id_criterio: number,
    @Body() dto: UpdateEvaluationCriterionDto,
  ) {
    return this.evaluationCriterionService.update(
      id_evaluacion,
      id_criterio,
      dto,
    );
  }

  @Delete(':id_evaluacion/:id_criterio')
  remove(
    @Param('id_evaluacion', ParseIntPipe) id_evaluacion: number,
    @Param('id_criterio', ParseIntPipe) id_criterio: number,
  ) {
    return this.evaluationCriterionService.remove(id_evaluacion, id_criterio);
  }
}

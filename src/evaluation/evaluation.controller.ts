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
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { FindEvaluationsQueryDto } from './dto/find-evaluations-query.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  create(@Body() dto: CreateEvaluationDto) {
    return this.evaluationService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindEvaluationsQueryDto) {
    return this.evaluationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOne(id);
  }

  @Post(':id/recalculate')
  recalculate(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.recalculate(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvaluationDto,
  ) {
    return this.evaluationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.remove(id);
  }
}

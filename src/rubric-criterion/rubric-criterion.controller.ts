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
import { RubricCriterionService } from './rubric-criterion.service';
import { CreateRubricCriterionDto } from './dto/create-rubric-criterion.dto';
import { FindRubricCriteriaQueryDto } from './dto/find-rubric-criteria-query.dto';
import { UpdateRubricCriterionDto } from './dto/update-rubric-criterion.dto';

@Controller('rubric-criterion')
export class RubricCriterionController {
  constructor(private readonly criterionService: RubricCriterionService) {}

  @Post()
  create(@Body() dto: CreateRubricCriterionDto) {
    return this.criterionService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindRubricCriteriaQueryDto) {
    return this.criterionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.criterionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRubricCriterionDto,
  ) {
    return this.criterionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.criterionService.remove(id);
  }
}

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
import { RubricService } from './rubric.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { FindRubricsQueryDto } from './dto/find-rubrics-query.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';

@Controller('rubric')
export class RubricController {
  constructor(private readonly rubricService: RubricService) {}

  @Post()
  create(@Body() dto: CreateRubricDto) {
    return this.rubricService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindRubricsQueryDto) {
    return this.rubricService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rubricService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRubricDto) {
    return this.rubricService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rubricService.remove(id);
  }
}

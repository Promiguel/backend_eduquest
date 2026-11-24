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
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { FindProblemsQueryDto } from './dto/find-problems-query.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  create(@Body() dto: CreateProblemDto) {
    return this.problemService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindProblemsQueryDto) {
    return this.problemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.problemService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemDto) {
    return this.problemService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.problemService.remove(id);
  }
}

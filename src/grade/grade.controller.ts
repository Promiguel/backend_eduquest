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
import { CreateGradeDto } from './dto/create-grade.dto';
import { FindGradesQueryDto } from './dto/find-grades-query.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeService } from './grade.service';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  create(@Body() dto: CreateGradeDto) {
    return this.gradeService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindGradesQueryDto) {
    return this.gradeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradeService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.gradeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradeService.remove(id);
  }
}

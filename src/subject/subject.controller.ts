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
import { CreateSubjectDto } from './dto/create-subject.dto';
import { FindSubjectsQueryDto } from './dto/find-subjects-query.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindSubjectsQueryDto) {
    return this.subjectService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.remove(id);
  }
}

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
import { CreateCourseDto } from './dto/create-course.dto';
import { FindCoursesQueryDto } from './dto/find-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindCoursesQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }
}

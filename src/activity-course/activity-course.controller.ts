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
import { ActivityCourseService } from './activity-course.service';
import { CreateActivityCourseDto } from './dto/create-activity-course.dto';
import { FindActivityCoursesQueryDto } from './dto/find-activity-courses-query.dto';
import { UpdateActivityCourseDto } from './dto/update-activity-course.dto';

@Controller('activity-course')
export class ActivityCourseController {
  constructor(private readonly assignmentService: ActivityCourseService) {}

  @Post()
  create(@Body() dto: CreateActivityCourseDto) {
    return this.assignmentService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindActivityCoursesQueryDto) {
    return this.assignmentService.findAll(query);
  }

  @Get('course/:id_curso')
  findByCourse(
    @Param('id_curso', ParseIntPipe) id_curso: number,
    @Query() query: FindActivityCoursesQueryDto,
  ) {
    return this.assignmentService.findByCourse(id_curso, query);
  }

  @Get('student/:id_estudiante/available')
  findAvailableForStudent(
    @Param('id_estudiante', ParseIntPipe) id_estudiante: number,
    @Query() query: FindActivityCoursesQueryDto,
  ) {
    return this.assignmentService.findAvailableForStudent(id_estudiante, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityCourseDto,
  ) {
    return this.assignmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.remove(id);
  }
}

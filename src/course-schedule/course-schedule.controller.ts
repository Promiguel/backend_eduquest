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
import { CreateCourseScheduleDto } from './dto/create-course-schedule.dto';
import { FindCourseSchedulesQueryDto } from './dto/find-course-schedules-query.dto';
import { UpdateCourseScheduleDto } from './dto/update-course-schedule.dto';
import { CourseScheduleService } from './course-schedule.service';

@Controller('course-schedule')
export class CourseScheduleController {
  constructor(private readonly scheduleService: CourseScheduleService) {}

  @Post()
  create(@Body() dto: CreateCourseScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindCourseSchedulesQueryDto) {
    return this.scheduleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseScheduleDto,
  ) {
    return this.scheduleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.remove(id);
  }
}

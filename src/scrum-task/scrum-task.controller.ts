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
import { CreateScrumTaskDto } from './dto/create-scrum-task.dto';
import { FindScrumTasksQueryDto } from './dto/find-scrum-tasks-query.dto';
import { UpdateScrumTaskDto } from './dto/update-scrum-task.dto';
import { ScrumTaskService } from './scrum-task.service';

@Controller('scrum-task')
export class ScrumTaskController {
  constructor(private readonly taskService: ScrumTaskService) {}

  @Post()
  create(@Body() dto: CreateScrumTaskDto) {
    return this.taskService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindScrumTasksQueryDto) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScrumTaskDto,
  ) {
    return this.taskService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
}

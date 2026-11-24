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
import { FindUserStoriesQueryDto } from '../user-story/dto/find-user-stories-query.dto';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { FindSprintsQueryDto } from './dto/find-sprints-query.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintService } from './sprint.service';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Post()
  create(@Body() dto: CreateSprintDto) {
    return this.sprintService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindSprintsQueryDto) {
    return this.sprintService.findAll(query);
  }

  @Get(':id/historias')
  findStories(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: FindUserStoriesQueryDto,
  ) {
    return this.sprintService.findStories(id, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprintService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSprintDto,
  ) {
    return this.sprintService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sprintService.remove(id);
  }
}

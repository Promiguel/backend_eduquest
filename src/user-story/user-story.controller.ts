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
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { FindUserStoriesQueryDto } from './dto/find-user-stories-query.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStoryService } from './user-story.service';

@Controller('user-story')
export class UserStoryController {
  constructor(private readonly storyService: UserStoryService) {}

  @Post()
  create(@Body() dto: CreateUserStoryDto) {
    return this.storyService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindUserStoriesQueryDto) {
    return this.storyService.findAll(query);
  }

  @Get(':id/tasks')
  findTasks(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.findTasks(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStoryDto,
  ) {
    return this.storyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.remove(id);
  }
}

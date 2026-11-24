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
import { ActivityLevelService } from './activity-level.service';
import { CreateActivityLevelDto } from './dto/create-activity-level.dto';
import { FindActivityLevelsQueryDto } from './dto/find-activity-levels-query.dto';
import { UpdateActivityLevelDto } from './dto/update-activity-level.dto';

@Controller('activity-level')
export class ActivityLevelController {
  constructor(private readonly levelService: ActivityLevelService) {}

  @Post()
  create(@Body() dto: CreateActivityLevelDto) {
    return this.levelService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindActivityLevelsQueryDto) {
    return this.levelService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityLevelDto,
  ) {
    return this.levelService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.remove(id);
  }
}

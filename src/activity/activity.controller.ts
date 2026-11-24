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
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FindActivitiesQueryDto } from './dto/find-activities-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindActivitiesQueryDto) {
    return this.activityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(id);
  }
}

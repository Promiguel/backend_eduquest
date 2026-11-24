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
import { CreateTopicDto } from './dto/create-topic.dto';
import { FindTopicsQueryDto } from './dto/find-topics-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindTopicsQueryDto) {
    return this.topicService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topicService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.topicService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.topicService.remove(id);
  }
}

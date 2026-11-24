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
import { AnswerOptionService } from './answer-option.service';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { FindAnswerOptionsQueryDto } from './dto/find-answer-options-query.dto';
import { UpdateAnswerOptionDto } from './dto/update-answer-option.dto';

@Controller('answer-option')
export class AnswerOptionController {
  constructor(private readonly optionService: AnswerOptionService) {}

  @Post()
  create(@Body() dto: CreateAnswerOptionDto) {
    return this.optionService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindAnswerOptionsQueryDto) {
    return this.optionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.optionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnswerOptionDto,
  ) {
    return this.optionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.optionService.remove(id);
  }
}

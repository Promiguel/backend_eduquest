import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AttemptResponseService } from './attempt-response.service';
import { CreateAttemptResponseDto } from './dto/create-attempt-response.dto';
import { FindAttemptResponsesQueryDto } from './dto/find-attempt-responses-query.dto';

@Controller('attempt-response')
export class AttemptResponseController {
  constructor(private readonly responseService: AttemptResponseService) {}

  @Post('attempt/:id_intento')
  create(
    @Param('id_intento', ParseIntPipe) id_intento: number,
    @Body() dto: CreateAttemptResponseDto,
  ) {
    return this.responseService.create(id_intento, dto);
  }

  @Get()
  findAll(@Query() query: FindAttemptResponsesQueryDto) {
    return this.responseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.responseService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.responseService.remove(id);
  }
}

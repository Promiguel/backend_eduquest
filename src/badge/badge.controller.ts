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
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { FindBadgesQueryDto } from './dto/find-badges-query.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  create(@Body() dto: CreateBadgeDto) {
    return this.badgeService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindBadgesQueryDto) {
    return this.badgeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBadgeDto) {
    return this.badgeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgeService.remove(id);
  }
}

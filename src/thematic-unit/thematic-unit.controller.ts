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
import { CreateThematicUnitDto } from './dto/create-thematic-unit.dto';
import { FindThematicUnitsQueryDto } from './dto/find-thematic-units-query.dto';
import { UpdateThematicUnitDto } from './dto/update-thematic-unit.dto';
import { ThematicUnitService } from './thematic-unit.service';

@Controller('thematic-unit')
export class ThematicUnitController {
  constructor(private readonly unitService: ThematicUnitService) {}

  @Post()
  create(@Body() dto: CreateThematicUnitDto) {
    return this.unitService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindThematicUnitsQueryDto) {
    return this.unitService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateThematicUnitDto,
  ) {
    return this.unitService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unitService.remove(id);
  }
}

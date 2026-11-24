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
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FindReportsQueryDto } from './dto/find-reports-query.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  generate(@Body() dto: CreateReportDto) {
    return this.reportService.generate(dto);
  }

  @Get()
  findAll(@Query() query: FindReportsQueryDto) {
    return this.reportService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.findOne(id);
  }

  @Post(':id/archive')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.archive(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.remove(id);
  }
}

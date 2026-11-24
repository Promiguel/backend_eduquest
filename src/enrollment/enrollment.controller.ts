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
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { FindEnrollmentsQueryDto } from './dto/find-enrollments-query.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindEnrollmentsQueryDto) {
    return this.enrollmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentService.remove(id);
  }
}

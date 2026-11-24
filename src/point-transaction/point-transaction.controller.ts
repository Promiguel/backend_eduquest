import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PointTransactionService } from './point-transaction.service';
import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { FindPointTransactionsQueryDto } from './dto/find-point-transactions-query.dto';

@Controller('point-transaction')
export class PointTransactionController {
  constructor(
    private readonly transactionService: PointTransactionService,
  ) {}

  @Post()
  create(@Body() dto: CreatePointTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindPointTransactionsQueryDto) {
    return this.transactionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(id);
  }
}

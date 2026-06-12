import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import 'multer'; 

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.transactionService.findOne(id);
  }
  
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.originalname.match(/\.(csv)$/)) {
      throw new BadRequestException('Solo se permiten archivos CSV');
    }
    return await this.transactionService.processCsv(file);
  }
}

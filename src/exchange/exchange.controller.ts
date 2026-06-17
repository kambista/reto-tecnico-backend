import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExchangeService } from './application/exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { CsvFileValidationPipe } from '../common/pipes/csv-validation.pipe';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExchangeResponseDto } from '../exchange-rate/dto/exchange-response.dto';
@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una operación de cambio',
  })
  @ApiResponse({
    status: 201,
    type: ExchangeResponseDto,
  })
  create(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.create(createExchangeDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una operación por ID',
  })
  @ApiParam({
    name: 'id',
    example: '6847a1b2c3d4e5f6',
    description: 'transaction id',
  })
  @ApiResponse({
    status: 201,
    type: ExchangeResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.exchangeService.findOne(id);
  }

  @Post('upload')
  @ApiOperation({
    summary: 'Procesar transacciones desde un archivo CSV',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo procesado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo inválido',
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadCsv(
    @UploadedFile(CsvFileValidationPipe)
    file: Express.Multer.File,
  ) {
    return this.exchangeService.processCsv(file);
  }
}

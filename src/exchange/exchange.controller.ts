import { Body, Controller, Post } from '@nestjs/common';
import { ExchangeService } from './application/exchange.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Post()
  create(@Body() createExchangeDto: CreateExchangeDto) {
    return this.exchangeService.create(createExchangeDto);
  }
}

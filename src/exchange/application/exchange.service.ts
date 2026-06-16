import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateExchangeDto, Currency } from '../dto/create-exchange.dto';
import Decimal from 'decimal.js';
import { ExchangeRateService } from '../../exchange-rate/exchange-rate.service';

@Injectable()
export class ExchangeService {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  create(createExchangeDto: CreateExchangeDto) {
    if (createExchangeDto.sourceCurrency === createExchangeDto.targetCurrency) {
      throw new BadRequestException('Currencies must be different');
    }
    const rate = this.exchangeRateService.getCurrentRate();

    const amount = new Decimal(createExchangeDto.amount);

    const convertedAmount =
      createExchangeDto.sourceCurrency === Currency.PEN
        ? amount.div(rate)
        : amount.mul(rate);

    return {
      amount: createExchangeDto.amount,
      exchangeRate: rate,
      convertedAmount: convertedAmount.toDecimalPlaces(2).toNumber(),
      sourceCurrency: createExchangeDto.sourceCurrency,
      targetCurrency: createExchangeDto.targetCurrency,
    };
  }
}

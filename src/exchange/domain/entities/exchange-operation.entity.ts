import { Currency } from '../../dto/create-exchange.dto';

export class ExchangeOperation {
  constructor(
    public readonly amount: number,
    public readonly exchangeRate: number,
    public readonly convertedAmount: number,
    public readonly sourceCurrency: Currency,
    public readonly targetCurrency: Currency,
  ) {}
}

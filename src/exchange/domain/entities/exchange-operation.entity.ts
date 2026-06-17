import { TransactionStatus } from '../../dto/create-exchange.dto';

export class ExchangeOperation {
  constructor(
    public readonly customerId: string,
    public readonly transactionId: string,
    public readonly exchangeRate: number,
    public readonly amountUsd: number,
    public readonly amountPen: number,
    public readonly status: TransactionStatus,
  ) {}
}

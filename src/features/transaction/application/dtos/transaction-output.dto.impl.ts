import { TransactionEntity } from "../../domain/entities/transaction.entity";
import TransactionOutputDTO from "../../domain/dtos/transaction-output.dto";

export default class TransactionOutputDTOImpl implements TransactionOutputDTO {
  private constructor(
    public readonly transactionId: string,
    public readonly customerId: string,
    public readonly exchangeRate: number,
    public readonly amountUsd: number,
    public readonly amountPen: number,
    public readonly status: string,
  ) {}

  static create(entity: TransactionEntity): TransactionOutputDTOImpl {
    return new TransactionOutputDTOImpl(
      entity.getId(),
      entity.getUserId(),
      entity.getExchangeRate(),
      entity.getAmountUsd(),
      entity.getAmountPen(),
      entity.getStatus(),
    );
  }
}

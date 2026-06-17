import { TransactionEntity } from "../domain/entities/transaction.entity";

import { TransactionRepository } from "../domain/repositories/transaction.repository";
import { RegisterUseCase } from "../domain/use-cases/register.use-case";
import { EXCHANGE_RATE } from "../domain/entities/constants";
import { OPERATIONS_TYPE, TRANSACTION_STATUS } from "../domain/entities/enum";
import RegisterTransactionInputDTO from "../domain/dtos/register-transaction-input.dto";

export class RegisterUseCaseImpl implements RegisterUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    input: RegisterTransactionInputDTO,
  ): Promise<TransactionEntity> {
    const transactionEntity = TransactionEntity.create({
      userId: input.customerId,
      amountUsd: input.amountUsd,
      exchangeRate: EXCHANGE_RATE,
      operationType: OPERATIONS_TYPE.USD_TO_PEN,
      status: TRANSACTION_STATUS.COMPLETED,
    });

    transactionEntity.convertUsdToPen();

    const result = await this.transactionRepository.register(transactionEntity);
    return result;
  }
}

import RegisterTransactionInputDTO from "../domain/dtos/register-transaction-input.dto";
import { EXCHANGE_RATE } from "../domain/entities/constants";
import { OPERATIONS_TYPE, TRANSACTION_STATUS } from "../domain/entities/enum";
import { TransactionEntity } from "../domain/entities/transaction.entity";
import { TransactionRepository } from "../domain/repositories/transaction.repository";
import { RegisterManyUseCase } from "../domain/use-cases/register-many.use-case";

export default class RegisterManyUseCaseImpl implements RegisterManyUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(
    inputs: RegisterTransactionInputDTO[],
  ): Promise<TransactionEntity[]> {
    const transactionEntities: TransactionEntity[] = inputs.map(
      (transactionDto) => {
        const transactionEntity = TransactionEntity.create({
          userId: transactionDto.customerId,
          amountUsd: transactionDto.amountUsd,
          exchangeRate: EXCHANGE_RATE,
          operationType: OPERATIONS_TYPE.USD_TO_PEN,
          status: TRANSACTION_STATUS.COMPLETED,
        });

        transactionEntity.convertUsdToPen();
        return transactionEntity;
      },
    );

    const results =
      await this.transactionRepository.registerMany(transactionEntities);

    return results;
  }
}

import RegisterTransactionInputDTO from "../dtos/register-transaction-input.dto";
import { TransactionEntity } from "../entities/transaction.entity";

export interface RegisterManyUseCase {
  execute(
    inputs: RegisterTransactionInputDTO[],
  ): Promise<TransactionEntity[]>;
}

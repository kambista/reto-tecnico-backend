import RegisterTransactionInputDTO from "../dtos/register-transaction-input.dto";
import { TransactionEntity } from "../entities/transaction.entity";

export interface RegisterUseCase {
  execute(input: RegisterTransactionInputDTO): Promise<TransactionEntity>;
}

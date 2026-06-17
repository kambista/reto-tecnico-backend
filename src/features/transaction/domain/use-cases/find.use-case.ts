import FindTransactionInputDTO from "../dtos/find-transaction-input.dto";
import { TransactionEntity } from "../entities/transaction.entity";

export interface FindUseCase {
  execute(input: FindTransactionInputDTO): Promise<TransactionEntity>;
}

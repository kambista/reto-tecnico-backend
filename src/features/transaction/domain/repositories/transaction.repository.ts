import { TransactionEntity } from "../entities/transaction.entity";

export interface TransactionRepository {
  register(data: TransactionEntity): Promise<TransactionEntity>;
  getById(id: string): Promise<TransactionEntity | null>;
  registerMany(data: TransactionEntity[]): Promise<TransactionEntity[]>;
}

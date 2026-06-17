import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import TransactionBD from "../database/transaction.mongodb";

export class TransactionRepositoryImpl implements TransactionRepository {
  async register(data: TransactionEntity): Promise<TransactionEntity> {
    const result = await TransactionBD.create({
      userId: data.getUserId(),
      operationType: data.getOperationType(),
      exchangeRate: data.getExchangeRate(),
      amountUsd: data.getAmountUsd(),
      amountPen: data.getAmountPen(),
      status: data.getStatus(),
    });

    return TransactionEntity.fromPersistence({
      id: result.id ?? "",
      userId: result.userId,
      amountUsd: result.amountUsd,
      amountPen: result.amountPen,
      exchangeRate: result.exchangeRate,
      operationType: result.operationType,
      status: result.status,
    });
  }

  async getById(id: string): Promise<TransactionEntity | null> {
    const result = await TransactionBD.findById(id);
    if (!result) return null;

    return TransactionEntity.fromPersistence({
      id: result.id ?? "",
      userId: result.userId,
      amountUsd: result.amountUsd,
      amountPen: result.amountPen,
      exchangeRate: result.exchangeRate,
      operationType: result.operationType,
      status: result.status,
    });
  }

  async registerMany(data: TransactionEntity[]): Promise<TransactionEntity[]> {
    const transactionsToCreate = data.map((transaction) => ({
      userId: transaction.getUserId(),
      operationType: transaction.getOperationType(),
      exchangeRate: transaction.getExchangeRate(),
      amountUsd: transaction.getAmountUsd(),
      amountPen: transaction.getAmountPen(),
      status: transaction.getStatus(),
    }));

    const results = await TransactionBD.insertMany(transactionsToCreate);

    return results.map((result) =>
      TransactionEntity.fromPersistence({
        id: result.id ?? "",
        userId: result.userId,
        amountUsd: result.amountUsd,
        amountPen: result.amountPen,
        exchangeRate: result.exchangeRate,
        operationType: result.operationType,
        status: result.status,
      }),
    );
  }
}

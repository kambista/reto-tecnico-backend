import AppError from "../../../shared/infrastructure/error/app-error";
import FindTransactionInputDTO from "../domain/dtos/find-transaction-input.dto";
import { TransactionEntity } from "../domain/entities/transaction.entity";
import { TransactionRepository } from "../domain/repositories/transaction.repository";
import { FindUseCase } from "../domain/use-cases/find.use-case";

export default class FindUseCaseImpl implements FindUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: FindTransactionInputDTO): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.getById(input.id);
    if (!transaction) throw AppError.notFound("Transaction not found");

    return transaction;
  }
}

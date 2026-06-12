import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Transaction } from "./entities/transaction.entity";

export interface ITransactionRepository {
    create(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
    findOne(id: string): Promise<Transaction | null>;
}
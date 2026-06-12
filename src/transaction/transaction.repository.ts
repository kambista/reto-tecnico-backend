import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Injectable } from "@nestjs/common";
import { ITransactionRepository } from "./ITransaction.repository";
import { Transaction } from "./entities/transaction.entity";
@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        private readonly prisma: PrismaService
    ) { }
    async findOne(id: string): Promise<Transaction | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id }
        });
        return transaction;
    }
    async create(createTransactionDto: CreateTransactionDto) {
        const { customerId, amountUsd } = createTransactionDto;
        const fixedExchangeRate = 3.75;
        const amountPEN = amountUsd * fixedExchangeRate;
        const transaction = await this.prisma.transaction.create({
            data: {
                customerId,
                amountUsd,
                amountPen: amountPEN,
                exchangeRate: fixedExchangeRate,
                status: 'COMPLETED',
            }
        });
        return transaction;
    };


}
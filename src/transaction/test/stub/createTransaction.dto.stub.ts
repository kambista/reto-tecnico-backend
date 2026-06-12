import { CreateTransactionDto } from "src/transaction/dto/create-transaction.dto";

export const createTransactionDtoStub = (): CreateTransactionDto => ({
    customerId: '123456789',
    amountUsd: 41,
});
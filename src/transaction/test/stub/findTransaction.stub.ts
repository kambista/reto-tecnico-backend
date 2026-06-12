import { transactionIdStub } from "./constants";

export const findTransactionStub = () => ({
    transactionId: transactionIdStub(),
    customerId: '123456789',
    exchangeRate: 3.75,
    amountUsd: 41,
    amountPen: 153.75,
    status: 'COMPLETED',
});
import { transactionIdStub } from "./constants";

export const createdTransactionStub = () =>  ({
    transactionId: transactionIdStub(),
    exchangeRate: 3.75,
    amountUsd: 41,
    amountPen: 153.75,
    status: 'COMPLETED',
})
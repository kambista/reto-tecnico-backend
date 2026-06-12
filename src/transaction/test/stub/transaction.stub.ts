import { fixedDateStub, transactionIdStub } from "./constants";

export const transactionStub = () => ({
    id: transactionIdStub(),
    customerId: '123',
    amountUsd: 100,
    amountPen: 350,
    exchangeRate: 3.5,
    status: 'pending',
    createdAt: fixedDateStub(),
    updatedAt: fixedDateStub()
})
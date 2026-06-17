export default interface TransactionOutputDTO {
  transactionId: string;
  customerId: string;
  exchangeRate: number;
  amountUsd: number;
  amountPen: number;
  status: string;
}

import { OPERATIONS_TYPE } from "./enum";

export class TransactionEntity {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly exchangeRate: number,
    private amountUsd: number,
    private amountPen: number,
    private readonly operationType: string,
    private readonly status: string,
  ) {}

  static create(params: {
    userId: string;
    amountUsd: number;
    exchangeRate: number;
    operationType: string;
    status: string;
  }): TransactionEntity {
    return new TransactionEntity(
      "",
      params.userId,
      params.exchangeRate,
      params.amountUsd,
      0,
      params.operationType,
      params.status,
    );
  }

  static fromPersistence(params: {
    id: string;
    userId: string;
    amountUsd: number;
    amountPen: number;
    exchangeRate: number;
    operationType: string;
    status: string;
  }): TransactionEntity {
    return new TransactionEntity(
      params.id,
      params.userId,
      params.exchangeRate,
      params.amountUsd,
      params.amountPen,
      params.operationType,
      params.status,
    );
  }

  convertUsdToPen(): void {
    if (this.operationType !== OPERATIONS_TYPE.USD_TO_PEN) {
      throw new Error("Operation type must be USD_TO_PEN");
    }
    this.amountPen =
      (this.amountUsd * 10000 * (this.exchangeRate * 10000)) / 100000000;
  }

  convertPenToUsd(): void {
    if (this.operationType !== OPERATIONS_TYPE.PEN_TO_USD) {
      throw new Error("Operation type must be PEN_TO_USD");
    }
    this.amountUsd = (this.amountPen * 10000) / (this.exchangeRate * 10000);
  }

  public getId(): string {
    return this.id;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getExchangeRate(): number {
    return this.exchangeRate;
  }
  public getAmountUsd(): number {
    return this.amountUsd;
  }
  public getAmountPen(): number {
    return this.amountPen;
  }
  public getOperationType(): string {
    return this.operationType;
  }
  public getStatus(): string {
    return this.status;
  }
}

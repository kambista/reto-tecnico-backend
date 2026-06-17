import { OPERATIONS_TYPE } from "./enum";
import { TransactionEntity } from "./transaction.entity";

describe("Transaction Entity", () => {
  it("Deberia crear una transaccion con propiedades validas", () => {
    const entity = TransactionEntity.create({
      userId: "user123",
      amountUsd: 100,
      exchangeRate: 3.5,
      operationType: OPERATIONS_TYPE.USD_TO_PEN,
      status: "pending",
    });

    expect(entity.getUserId()).toBe("user123");
    expect(entity.getAmountUsd()).toBe(100);
    expect(entity.getExchangeRate()).toBe(3.5);
    expect(entity.getOperationType()).toBe(OPERATIONS_TYPE.USD_TO_PEN);
    expect(entity.getStatus()).toBe("pending");
  });

  it("Deberia convertir USD a PEN correctamente", () => {
    const entity = TransactionEntity.create({
      userId: "user123",
      amountUsd: 100,
      exchangeRate: 3.5,
      operationType: OPERATIONS_TYPE.USD_TO_PEN,
      status: "pending",
    });

    entity.convertUsdToPen();
    expect(entity.getAmountPen()).toBe(350);
  });

  it("Deberia lanzar un error cuando se intenta convertir USD a PEN con un tipo de operación incorrecto", () => {
    const entity = TransactionEntity.create({
      userId: "user123",
      amountUsd: 100,
      exchangeRate: 3.5,
      operationType: OPERATIONS_TYPE.PEN_TO_USD,
      status: "pending",
    });

    expect(() => entity.convertUsdToPen()).toThrow(
      "Operation type must be USD_TO_PEN",
    );
  });
});

import AppError from "../../../../shared/infrastructure/error/app-error";
import RegisterTransactionInputDTOImpl from "./register-transaction-input.dto.impl";

describe("RegisterTransactionInputDTOImpl", () => {
  test("Deberia crear una instancia de RegisterTransactionInputDTOImpl con propiedades validas", () => {
    const input = RegisterTransactionInputDTOImpl.create({
      customerId: "6a30db37f65c98f64050a329",
      amountUsd: 100,
    });
    expect(input.customerId).toBe("6a30db37f65c98f64050a329");
    expect(input.amountUsd).toBe(100);
  });

  test("Deberia retornar errores de validacion si el customerId es invalido", () => {
    expect(() => {
      RegisterTransactionInputDTOImpl.create({
        customerId: "invalid-id",
        amountUsd: 100,
      });
    }).toThrow("customerId is not valid");
  });

  describe("Campo amountUsd", () => {
    test("Deberia retornar errores de validacion si el amountUsd no es numerico", () => {
      expect(() => {
        RegisterTransactionInputDTOImpl.create({
          customerId: "6a30db37f65c98f64050a329",
          amountUsd: "invalid-amount",
        });
      }).toThrow("amountUsd is invalid");
    });

    test("Deberia retornar errores de validacion si el amountUsd no es numerico", () => {
      expect(() => {
        RegisterTransactionInputDTOImpl.create({
          customerId: "6a30db37f65c98f64050a329",
          amountUsd: "invalid-amount",
        });
      }).toThrow("amountUsd is invalid");
    });

    test("Deberia retornar errores de validacion si el amountUsd es menor a cero", () => {
      expect(() => {
        RegisterTransactionInputDTOImpl.create({
          customerId: "6a30db37f65c98f64050a329",
          amountUsd: -1,
        });
      }).toThrow("amountUsd must be greater than 0");
    });

    test("Deberia retornar errores de validacion si el amountUsd es igual a cero", () => {
      expect(() => {
        RegisterTransactionInputDTOImpl.create({
          customerId: "6a30db37f65c98f64050a329",
          amountUsd: 0,
        });
      }).toThrow("amountUsd must be greater than 0");
    });
  });
});

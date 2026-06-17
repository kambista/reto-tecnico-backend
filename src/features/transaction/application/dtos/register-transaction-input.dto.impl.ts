import mongoose from "mongoose";
import AppError from "../../../../shared/infrastructure/error/app-error";
import RegisterTransactionInputDTO from "../../domain/dtos/register-transaction-input.dto";

type NumericValidationResult =
  | { isValid: true; parsedValue: number }
  | { isValid: false; error: string };

const isNumeric = (data: Record<string, unknown>): NumericValidationResult => {
  const field = Object.keys(data)[0];
  const value = Object.values(data)[0];

  if (typeof value === "number") {
    return { isValid: true, parsedValue: value };
  }

  if (typeof value === "string") {
    if (!value) {
      return { isValid: false, error: `${field} is required` };
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return { isValid: false, error: `${field} is invalid` };
    }

    return {
      isValid: true,
      parsedValue: parsedValue,
    };
  }

  return { isValid: false, error: `${field} is invalid` };
};

export default class RegisterTransactionInputDTOImpl implements RegisterTransactionInputDTO {
  private constructor(
    public readonly customerId: string,
    public readonly amountUsd: number,
  ) {}

  static create(body: unknown): RegisterTransactionInputDTOImpl {
    const { customerId, amountUsd } = body as Record<string, unknown>;

    const errors: string[] = [];

    if (!customerId || typeof customerId !== "string") {
      errors.push("customerId is required and must be a string");
    } else if (!mongoose.Types.ObjectId.isValid(customerId)) {
      errors.push("customerId is not valid");
    }

    const validateAmountUsd = isNumeric({ amountUsd });
    let parsedAmountUsd: number = 0;
    if (!validateAmountUsd.isValid) {
      errors.push(validateAmountUsd.error);
    } else {
      parsedAmountUsd = validateAmountUsd.parsedValue;
      if (validateAmountUsd.parsedValue <= 0) {
        errors.push("amountUsd must be greater than 0");
      }
    }

    if (errors.length > 0) {
      throw AppError.badRequest(errors);
    }

    return new RegisterTransactionInputDTOImpl(
      customerId as string,
      parsedAmountUsd,
    );
  }
}

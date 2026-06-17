import mongoose from "mongoose";
import AppError from "../../../../shared/infrastructure/error/app-error";
import FindTransactionInputDTO from "../../domain/dtos/find-transaction-input.dto";

export default class FindTransactionInputDTOImpl implements FindTransactionInputDTO {
  private constructor(public readonly id: string) {}

  static create(body: unknown): FindTransactionInputDTOImpl {
    const { id } = body as Record<string, unknown>;

    if (!id || typeof id !== "string") {
      throw AppError.badRequest("id is required");
    } else if (mongoose.Types.ObjectId.isValid(id) === false) {
      throw AppError.badRequest("id is not valid");
    }

    return new FindTransactionInputDTOImpl(id);
  }
}

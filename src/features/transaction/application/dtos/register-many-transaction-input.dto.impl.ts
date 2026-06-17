import AppError from "../../../../shared/infrastructure/error/app-error";
import RegisterManyTransactionInputDTO from "../../domain/dtos/register-many-transaction-input.dto";

export default class RegisterManyTransactionInputDTOImpl implements RegisterManyTransactionInputDTO {
  private constructor(public readonly file: Express.Multer.File) {}

  static create(
    file: Express.Multer.File | undefined,
  ): RegisterManyTransactionInputDTOImpl {
    if (!file) {
      throw AppError.badRequest("File is required");
    }

    if (file.mimetype !== "text/csv" && !file.originalname.endsWith(".csv")) {
      throw AppError.badRequest("The file must be a valid CSV format.");
    }

    return new RegisterManyTransactionInputDTOImpl(file);
  }
}

import { readCSV } from "../../../shared/infrastructure/csv/read-csv";
import AppError from "../../../shared/infrastructure/error/app-error";
import RegisterManyTransactionInputDTO from "../domain/dtos/register-many-transaction-input.dto";
import RegisterTransactionInputDTO from "../domain/dtos/register-transaction-input.dto";
import { UploadTransactionsUseCase } from "../domain/use-cases/upload-transactions.use-case";
import RegisterTransactionInputDTOImpl from "./dtos/register-transaction-input.dto.impl";

export default class UploadTransactionsUseCaseImpl implements UploadTransactionsUseCase {
  async execute(
    input: RegisterManyTransactionInputDTO,
  ): Promise<RegisterTransactionInputDTO[]> {
    const rows: RegisterTransactionInputDTOImpl[] = [];
    const rowsErrors: { row: number; errors: string[] }[] = [];

    const rowsCSV = await readCSV(input.file.buffer);

    for (const rowCSV of rowsCSV) {
      const { index, ...data } = rowCSV;
      try {
        const dto = RegisterTransactionInputDTOImpl.create(data);
        rows.push(dto);
      } catch (error) {
        if (error instanceof AppError) {
          rowsErrors.push({
            row: index,
            errors: error.errors ?? [error.message],
          });
        } else {
          rowsErrors.push({
            row: index,
            errors: ["Error desconocido al procesar la fila"],
          });
        }
      }
    }

    if (rowsErrors.length !== 0) {
      const errors = rowsErrors.map(
        (e) => `Fila ${e.row}: ${e.errors.join(", ")}`,
      );
      throw AppError.badRequest(errors);
    }

    return rows;
  }
}

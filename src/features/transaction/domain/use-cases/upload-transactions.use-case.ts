import RegisterManyTransactionInputDTO from "../dtos/register-many-transaction-input.dto";
import RegisterTransactionInputDTO from "../dtos/register-transaction-input.dto";

export interface UploadTransactionsUseCase {
  execute(
    input: RegisterManyTransactionInputDTO,
  ): Promise<RegisterTransactionInputDTO[]>;
}

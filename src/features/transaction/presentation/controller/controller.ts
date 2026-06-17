import { Request, Response } from "express";

import { RegisterUseCase } from "../../domain/use-cases/register.use-case";
import { FindUseCase } from "../../domain/use-cases/find.use-case";

import RegisterTransactionInputDTOImpl from "../../application/dtos/register-transaction-input.dto.impl";
import FindTransactionInputDTOImpl from "../../application/dtos/find-transaction-input.dto.impl";
import TransactionOutputDTOImpl from "../../application/dtos/transaction-output.dto.impl";
import { RegisterManyUseCase } from "../../domain/use-cases/register-many.use-case";
import { UploadTransactionsUseCase } from "../../domain/use-cases/upload-transactions.use-case";
import RegisterManyTransactionInputDTOImpl from "../../application/dtos/register-many-transaction-input.dto.impl";
import RegisterTransactionInputDTO from "../../domain/dtos/register-transaction-input.dto";

export class TransactionController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly findUseCase: FindUseCase,
    private readonly registerManyUseCase: RegisterManyUseCase,
    private readonly uploadTransactionsUseCase: UploadTransactionsUseCase,
  ) {}

  async register(req: Request, res: Response) {
    const input = RegisterTransactionInputDTOImpl.create(req.body);
    const transaction = await this.registerUseCase.execute(input);
    const response = TransactionOutputDTOImpl.create(transaction);
    res.status(201).json(response);
  }

  async find(req: Request, res: Response) {
    const input = FindTransactionInputDTOImpl.create(req.params);
    const transaction = await this.findUseCase.execute(input);
    const response = TransactionOutputDTOImpl.create(transaction);
    res.status(200).json(response);
  }

  async upload(req: Request, res: Response) {
    const input = RegisterManyTransactionInputDTOImpl.create(req.file);

    const rows: RegisterTransactionInputDTO[] =
      await this.uploadTransactionsUseCase.execute(input);

    const transactions = await this.registerManyUseCase.execute(rows);
    const response = transactions.map((transaction) =>
      TransactionOutputDTOImpl.create(transaction),
    );
    res.status(200).json(response);
  }
}

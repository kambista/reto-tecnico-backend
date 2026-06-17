import { Router } from "express";
import multer from "multer";

import { TransactionController } from "./controller/controller";

import { RegisterUseCase } from "../domain/use-cases/register.use-case";
import { FindUseCase } from "../domain/use-cases/find.use-case";

import { TransactionRepository } from "../domain/repositories/transaction.repository";

import { TransactionRepositoryImpl } from "../infrastructure/repositories/transaction.repository.impl";

import FindUseCaseImpl from "../application/find.use-case.impl";
import { RegisterUseCaseImpl } from "../application/register.use-case.impl";
import { errorMiddleware } from "../../../shared/infrastructure/error/error-handler";
import { RegisterManyUseCase } from "../domain/use-cases/register-many.use-case";
import RegisterManyUseCaseImpl from "../application/register-many.use-case.impl";
import { UploadTransactionsUseCase } from "../domain/use-cases/upload-transactions.use-case";
import UploadTransactionsUseCaseImpl from "../application/upload-transactions.use-case.impl";

const upload = multer({ storage: multer.memoryStorage() });

export default class TransactionRouter {
  static get routes() {
    const router = Router();

    const transactionRepository: TransactionRepository =
      new TransactionRepositoryImpl();
    const registerUseCase: RegisterUseCase = new RegisterUseCaseImpl(
      transactionRepository,
    );

    const findUseCase: FindUseCase = new FindUseCaseImpl(transactionRepository);

    const registerManyUseCase: RegisterManyUseCase =
      new RegisterManyUseCaseImpl(transactionRepository);

    const uploadTransactionsUseCase: UploadTransactionsUseCase =
      new UploadTransactionsUseCaseImpl();

    const controller = new TransactionController(
      registerUseCase,
      findUseCase,
      registerManyUseCase,
      uploadTransactionsUseCase,
    );

    /**
     * @openapi
     * /transaction/{id}:
     *   get:
     *     summary: Obtiene una transacción por id
     *     tags: [Transaction]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Transacción encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/TransactionOutput'
     *       404:
     *         description: No encontrada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get("/:id", errorMiddleware(controller.find.bind(controller)));

    /**
     * @openapi
     * /transaction:
     *   post:
     *     summary: Registra una transacción
     *     tags: [Transaction]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterTransactionInput'
     *     responses:
     *       201:
     *         description: Transacción creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/TransactionOutput'
     *       400:
     *         description: Datos inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post("/", errorMiddleware(controller.register.bind(controller)));

    /**
     * @openapi
     * /transaction/upload:
     *   post:
     *     summary: Carga masiva de transacciones vía CSV
     *     description: |
     *       Recibe un archivo CSV con las columnas `customerId` y `amountUsd`.
     *       Cada fila se valida individualmente. Si alguna fila es inválida,
     *       no se registra ninguna transacción y se devuelven los errores
     *       agrupados por número de fila.
     *     tags: [Transaction]
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - file
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Archivo CSV con columnas customerId, amountUsd
     *     responses:
     *       200:
     *         description: Transacciones registradas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/TransactionOutput'
     *       400:
     *         description: Datos inválidos
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post(
      "/upload",
      upload.single("file"),
      errorMiddleware(controller.upload.bind(controller)),
    );

    return router;
  }
}

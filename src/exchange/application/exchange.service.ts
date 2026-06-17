import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateExchangeDto,
  Currency,
  TransactionStatus,
} from '../dto/create-exchange.dto';
import Decimal from 'decimal.js';
import { ExchangeRateService } from '../../exchange-rate/exchange-rate.service';
import { EXCHANGE_OPERATION_REPOSITORY } from '../../common/constants/injection-token';
import type { ExchangeOperationRepository } from '../domain/repositories/exchange-operation.repository';
import { ExchangeOperation } from '../domain/entities/exchange-operation.entity';

import { v4 as uuidv4 } from 'uuid';
import csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class ExchangeService {
  constructor(
    private readonly exchangeRateService: ExchangeRateService,
    @Inject(EXCHANGE_OPERATION_REPOSITORY)
    private readonly repository: ExchangeOperationRepository,
  ) {}

  async create(createExchangeDto: CreateExchangeDto) {
    const rate = this.exchangeRateService.getCurrentRate();

    const amount = new Decimal(createExchangeDto.amountUsd);

    const transactionId = uuidv4();

    const { amountUsd, amountPen } = this.calculateAmounts(
      amount,
      rate,
      Currency.USD,
    );

    const exchangeOperation = new ExchangeOperation(
      createExchangeDto.customerId,
      transactionId,
      rate,
      amountUsd,
      amountPen,
      TransactionStatus.COMPLETED,
    );

    const operation = await this.repository.create(exchangeOperation);

    return {
      transactionId: operation.transactionId,
      exchangeRate: operation.exchangeRate,
      amountUsd: operation.amountUsd,
      amountPen: operation.amountPen,
      status: operation.status,
    };
  }

  private calculateAmounts(
    amount: Decimal,
    rate: number,
    sourceCurrency: Currency,
  ) {
    const strategies = {
      [Currency.PEN]: () => ({
        amountPen: amount.toNumber(),
        amountUsd: amount.div(rate).toDecimalPlaces(2).toNumber(),
      }),
      [Currency.USD]: () => ({
        amountUsd: amount.toNumber(),
        amountPen: amount.mul(rate).toDecimalPlaces(2).toNumber(),
      }),
    };

    return strategies[sourceCurrency]();
  }

  async findOne(transationId: string) {
    const operation = await this.repository.findByTransactionId(transationId);

    if (!operation) {
      throw new NotFoundException('Transaction not found');
    }

    return operation;
  }

  async processCsv(file: Express.Multer.File) {
    const rows: any[] = [];

    // procesando csv
    await new Promise<void>((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve())
        .on('error', reject);
    });

    if (rows.length === 0) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'FILE_EMPTY',
          message: 'CSV file is empty',
        },
      });
    }

    const headers = Object.keys(rows[0]);

    const expectedHeaders = ['customerId', 'amountUsd'];

    const invalidHeaders = expectedHeaders.filter(
      (header) => !headers.includes(header),
    );

    if (invalidHeaders.length > 0) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INVALID_CSV_HEADERS',
          message: `Missing headers: ${invalidHeaders.join(', ')}`,
        },
      });
    }

    let processed = 0;
    let failed = 0;

    const errors: {
      row: number;
      code: string;
      message: string;
    }[] = [];

    for (const [index, row] of rows.entries()) {
      if (!row.customerId?.trim()) {
        failed++;

        errors.push({
          code: 'INVALID_CUSTOMER_ID',
          row: index + 2,
          message: 'customerId is required',
        });

        continue;
      }

      const amountUsd = Number(row.amountUsd);

      if (Number.isNaN(amountUsd)) {
        failed++;

        errors.push({
          code: 'INVALID_AMOUNT',
          row: index + 2,
          message: 'amountUsd must be numeric',
        });
        continue;
      }

      if (amountUsd <= 0) {
        failed++;
        errors.push({
          code: 'INVALID_AMOUNT',
          row: index + 2,
          message: 'amountUsd must be greater than zero',
        });
        continue;
      }

      try {
        await this.create({
          customerId: row.customerId,
          amountUsd: Number(row.amountUsd),
        });

        processed++;
      } catch (error) {
        failed++;

        errors.push({
          row: index + 2,
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unexpected error',
        });
      }
    }

    return {
      processed,
      failed,
      errors,
    };
  }
}

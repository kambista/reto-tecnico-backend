import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ExchangeOperationRepository } from '../../domain/repositories/exchange-operation.repository';
import { ExchangeOperation } from '../../domain/entities/exchange-operation.entity';
import { ExchangeOperationDocument } from './exchange-operation.schema';
import { TransactionStatus } from '../../dto/create-exchange.dto';

@Injectable()
export class MongoExchangeOperationRepository implements ExchangeOperationRepository {
  constructor(
    @InjectModel(ExchangeOperationDocument.name)
    private readonly model: Model<ExchangeOperationDocument>,
  ) {}

  async create(operation: ExchangeOperation): Promise<ExchangeOperation> {
    const document = await this.model.create(operation);

    return new ExchangeOperation(
      document.customerId,
      document.transactionId,
      document.exchangeRate,
      document.amountUsd,
      document.amountPen,
      document.status as TransactionStatus.COMPLETED,
    );
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<ExchangeOperation | null> {
    const document = await this.model.findOne({
      transactionId,
    });

    if (!document) {
      return null;
    }

    return new ExchangeOperation(
      document.transactionId,
      document.customerId,
      document.exchangeRate,
      document.amountUsd,
      document.amountPen,
      document.status as TransactionStatus,
    );
  }
}

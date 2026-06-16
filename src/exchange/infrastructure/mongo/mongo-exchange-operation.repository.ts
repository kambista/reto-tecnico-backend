import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ExchangeOperationRepository } from '../../domain/repositories/exchange-operation.repository';
import { ExchangeOperation } from '../../domain/entities/exchange-operation.entity';
import { ExchangeOperationDocument } from './exchange-operation.schema';
import { Currency } from '../../dto/create-exchange.dto';

@Injectable()
export class MongoExchangeOperationRepository implements ExchangeOperationRepository {
  constructor(
    @InjectModel(ExchangeOperationDocument.name)
    private readonly model: Model<ExchangeOperationDocument>,
  ) {}

  async create(operation: ExchangeOperation): Promise<ExchangeOperation> {
    const document = await this.model.create(operation);

    return new ExchangeOperation(
      document.amount,
      document.exchangeRate,
      document.convertedAmount,
      document.sourceCurrency as Currency,
      document.targetCurrency as Currency,
    );
  }
}

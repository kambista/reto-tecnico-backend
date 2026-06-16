import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExchangeController } from './exchange.controller';

import { ExchangeService } from './application/exchange.service';

import {
  ExchangeOperationDocument,
  ExchangeOperationSchema,
} from './infrastructure/mongo/exchange-operation.schema';

import { MongoExchangeOperationRepository } from './infrastructure/mongo/mongo-exchange-operation.repository';

import { EXCHANGE_OPERATION_REPOSITORY } from '../constants/injection-token';

import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

@Module({
  imports: [
    ExchangeRateModule,
    MongooseModule.forFeature([
      {
        name: ExchangeOperationDocument.name,
        schema: ExchangeOperationSchema,
      },
    ]),
  ],
  controllers: [ExchangeController],
  providers: [
    ExchangeService,
    {
      provide: EXCHANGE_OPERATION_REPOSITORY,
      useClass: MongoExchangeOperationRepository,
    },
  ],
})
export class ExchangeModule {}

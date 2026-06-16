import { ExchangeOperation } from '../entities/exchange-operation.entity';

export interface ExchangeOperationRepository {
  create(operation: ExchangeOperation): Promise<ExchangeOperation>;
}

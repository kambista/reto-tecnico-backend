import { Test, TestingModule } from '@nestjs/testing';

import { ExchangeService } from './exchange.service';
import { ExchangeRateService } from '../../exchange-rate/exchange-rate.service';
import { EXCHANGE_OPERATION_REPOSITORY } from '../../common/constants/injection-token';
import { ExchangeOperation } from '../domain/entities/exchange-operation.entity';

describe('ExchangeService', () => {
  let service: ExchangeService;

  const repositoryMock = {
    create: jest.fn(),
    findByTransactionId: jest.fn(),
  };

  beforeEach(async () => {
    repositoryMock.create.mockImplementation(
      (operation: ExchangeOperation): ExchangeOperation => operation,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        {
          provide: ExchangeRateService,
          useValue: {
            getCurrentRate: jest.fn().mockReturnValue(3.75),
          },
        },
        {
          provide: EXCHANGE_OPERATION_REPOSITORY,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should convert 100 USD to 375 PEN', async () => {
    const result = await service.create({
      customerId: '123',
      amountUsd: 100,
    });
    expect(result.amountUsd).toBe(100);

    expect(result.amountPen).toBe(375);

    expect(result.exchangeRate).toBe(3.75);

    expect(result.status).toBe('COMPLETED');
  });
});

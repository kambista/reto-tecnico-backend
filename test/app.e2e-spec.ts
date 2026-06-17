import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Transactions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /exchange', async () => {
    const response = await request(app.getHttpServer())
      .post('/exchange')
      .send({
        customerId: '123',
        amountUsd: 100,
      })
      .expect(201);

    expect(response.body.amountUsd).toBe(100);

    expect(response.body.amountPen).toBe(375);

    expect(response.body.exchangeRate).toBe(3.75);

    expect(response.body.status).toBe('COMPLETED');

    expect(response.body.transactionId).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { createTransactionDtoStub } from '../stub';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { createRequest } from 'test/helpers/request';
import { csvFileStub } from '../stub/csvFile.stub';

describe('Transaction (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let transactionRequest: ReturnType<typeof createRequest>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    prisma = moduleFixture.get(PrismaService);
    await app.init();
    transactionRequest = createRequest(app, '/transactions');

  });

  async function createTransaction(): Promise<CreateTransactionDto> {
    let dto = createTransactionDtoStub();
    let response = await transactionRequest.post('/').send(dto);
    return response.body;
  }
  describe('/transaction (POST)', () => {
    describe('when create is called, it should', () => {
      let response: any;
      let dto: CreateTransactionDto;
      let transactionCreated: any;
      beforeEach(async () => {
        dto = createTransactionDtoStub();
        response = await transactionRequest.post('/').send(dto);
        transactionCreated = response.body;
      });
      test('return status 201', () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });
      test('return the created transaction', () => {
        expect(transactionCreated.transactionId).toBeDefined();
        expect(transactionCreated.exchangeRate).toBeDefined();
        expect(transactionCreated.amountUsd).toBeDefined();
        expect(transactionCreated.amountPen).toBeDefined();
        expect(transactionCreated.status).toBeDefined();
      });
    });
    describe('when create is called with invalid data, it should', () => {
      let response: any;
      beforeEach(async () => {
        response = await transactionRequest.post('/').send({
          customerId: '132',
          amountUsd: -5,
        });
      });
      test('return status 400', () => {
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('/transaction/:id (GET)', () => {
    describe('when findOne is called with an existing transaction, it should', () => {
      let response: any;
      let transactionCreated: any;
      beforeEach(async () => {
        transactionCreated = await createTransaction();
        response = await transactionRequest.get(`/${transactionCreated.transactionId}`);
      });
      test('return status 200', () => {
        expect(response.status).toBe(HttpStatus.OK);
      });
      test('return the found transaction', () => {
        expect(response.body.transactionId).toBe(transactionCreated.transactionId);
      });
    });
    describe('when findOne is called with a non existing transaction, it should', () => {
      let response: any;
      beforeEach(async () => {
        response = await transactionRequest.get(`/${'00000000-0000-0000-0000-000000000000'}`);
      });
      test('return status 404', () => {
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('/transaction/upload (POST)', () => {
    describe('when uploadFile is called with a valid csv file, it should', () => {
      let response: any;
      beforeEach(async () => {
        response = await transactionRequest.post('/upload')
          .attach('file', csvFileStub().buffer, csvFileStub().originalname);
      });
      test('return status 201', () => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });
      test('process the csv file and create transactions', () => {
        expect(response.body).toBeDefined();
        expect(response.body.processed).toBe(1);
        expect(response.body.errors).toBe(0);
      });
    });
    describe('when uploadFile is called without a file, it should', () => {
      let response: any;
      beforeEach(async () => {
        response = await transactionRequest.post('/upload');
      });
      test('return status 400', () => {
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});

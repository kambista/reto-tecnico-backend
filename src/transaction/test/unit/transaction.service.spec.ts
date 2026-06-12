import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../transaction.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { transactionRepositoryMock } from 'src/transaction/mock/transactionRepository.mock';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';
import { createTransactionDtoStub, transactionStub } from '../stub';
import { csvFileStub } from '../stub/csvFile.stub';
import { BadRequestException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let TransactionRepository: jest.Mocked<TransactionRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'ITransactionRepository',
          useValue: transactionRepositoryMock()
        }
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    TransactionRepository = jest.mocked(module.get<TransactionRepository>('ITransactionRepository'));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    describe('when create is called, then it should', () => {
      let dto: CreateTransactionDto;
      let response: any;
      beforeEach(() => {
        TransactionRepository.create.mockResolvedValue(transactionStub());
        dto = createTransactionDtoStub();
        response = service.create(dto);
      });
      test('call transactionRepository.create with correct params', () => {
        expect(TransactionRepository.create).toHaveBeenCalledWith(dto);
      });
      test('return the created transaction', () => {
        expect(response).resolves.toEqual({
          transactionId: transactionStub().id,
          exchangeRate: transactionStub().exchangeRate,
          amountUsd: transactionStub().amountUsd,
          amountPen: transactionStub().amountPen,
          status: transactionStub().status,
        });
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called with an existing transaction, then it should', () => {
      let response: any;
      beforeEach(() => {
        TransactionRepository.findOne.mockResolvedValue(transactionStub());
        response = service.findOne(transactionStub().id);
      });
      test('call transactionRepository.findOne with correct params', () => {
        expect(TransactionRepository.findOne).toHaveBeenCalledWith(transactionStub().id);
      });
      test('return the found transaction', () => {
        expect(response).resolves.toEqual({
          transactionId: transactionStub().id,
          customerId: transactionStub().customerId,
          exchangeRate: transactionStub().exchangeRate,
          amountUsd: transactionStub().amountUsd,
          amountPen: transactionStub().amountPen,
          status: transactionStub().status,
        });
      });
    });
    describe('when findOne is called with a non existing transaction, then it should', () => {
      let response: any;
      beforeEach(() => {
        TransactionRepository.findOne.mockResolvedValue(null);
        response = service.findOne(transactionStub().id);
      });
      test('throw a BadRequestException', () => {
        expect(response).rejects.toThrow('Transaction not found');
      });
    });
  });

  describe('processCsv', () => {
    describe('when processCsv is called, then it should', () => {
      let file: Express.Multer.File;
      let response: any;
      beforeEach(async () => {
        file = csvFileStub();
        response = await service.processCsv(file);
      });
      test('process the csv file and create have been called', () => {
        expect(TransactionRepository.create).toHaveBeenCalledWith({
          customerId: '1',
          amountUsd: 100,
        });
      });
    });
    describe('when processCsv is called with an invalid file, then it should', () => {
      let response: any;
      let invalidFile: any;
      beforeEach(async () => {
        invalidFile = {
          buffer: Buffer.from('customerId,amountUsd\n1,-100'),
          originalname: 'transactions.csv',
        } as Express.Multer.File;
      });
      test('throw an error', async () => {
        await expect(service.processCsv(invalidFile)).rejects.toThrow();
      });
      test('throw an error BadRequestException', async () => {
        await expect(service.processCsv(invalidFile)).rejects.toThrow(BadRequestException);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../transaction.controller';
import { TransactionService } from '../../transaction.service';
import { transactionServiceMock } from 'src/transaction/mock';
import { createdTransactionStub, createTransactionDtoStub, findTransactionStub, transactionIdStub } from '../stub';
import { csvFileStub } from '../stub/csvFile.stub';
import { BadRequestException } from '@nestjs/common';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: jest.Mocked<TransactionService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: transactionServiceMock()
        }
      ],
    }).compile();
    controller = module.get<TransactionController>(TransactionController);
    transactionService = jest.mocked(module.get<TransactionService>(TransactionService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    describe('when create is called, it should', () => {
      let result: any;
      beforeEach(() => {
        transactionService.create.mockResolvedValue(createdTransactionStub());
        result = controller.create(createTransactionDtoStub());
      });
      test('call transactionService.create with correct params', () => {
        expect(transactionService.create).toHaveBeenCalledWith(createTransactionDtoStub());
      });
      test('return the created transaction', () => {
        expect(result).resolves.toEqual(createdTransactionStub());
      });
    });
  })

  describe('findOne', () => {
    describe('when findOne is called, it should', () => {
      let result: any;
      const id = transactionIdStub();
      beforeEach(() => {
        transactionService.findOne.mockResolvedValue(findTransactionStub());
        result = controller.findOne(id);
      });

      test('call transactionService.findOne with correct params', () => {
        expect(transactionService.findOne).toHaveBeenCalledWith(id);
      });
      test('return the found transaction', () => {
        expect(result).resolves.toEqual(findTransactionStub());
      });
    });
  });

  describe('uploadFile', () => {
    describe('when uploadFile is called, it should', () => {
      let result: any;
      const file = csvFileStub();
      beforeEach(() => {
        transactionService.processCsv.mockResolvedValue(undefined);
        result = controller.uploadFile(file);
      });

      test('call transactionService.processCsv with correct params', () => {
        expect(transactionService.processCsv).toHaveBeenCalledWith(file);
      });
      test('return undefined', () => {
        expect(result).resolves.toBeUndefined();
      });
    });
    describe('when uploadFile is called with incorrect type of file, it should', () => {
      let result: any;
      beforeEach(() => {
        result = controller.uploadFile(
          {
            ...csvFileStub(),
            originalname: 'transactions.txt',
          } as Express.Multer.File
        );
      });
      test('throw a BadRequestException', () => {
        expect(result).rejects.toThrow(BadRequestException);
      });
    });
  });
});

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import type { ITransactionRepository } from './ITransaction.repository';

@Injectable()
export class TransactionService {

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionRepository.create(createTransactionDto);
    return {
      transactionId: transaction.id,
      exchangeRate: transaction.exchangeRate,
      amountUsd: transaction.amountUsd,
      amountPen: transaction.amountPen,
      status: transaction.status,
    };
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      transactionId: transaction.id,
      customerId: transaction.customerId,
      exchangeRate: transaction.exchangeRate,
      amountUsd: transaction.amountUsd,
      amountPen: transaction.amountPen,
      status: transaction.status,
    };
  }

  async processCsv(file: Express.Multer.File) {
    const fixedExchangeRate = 3.75; // Example fixed exchange rate
    const rawRows: any[] = [];
    const stream = Readable.from(file.buffer);

    const processCsvPromise = new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', async (csvRow: any) => {
          rawRows.push(csvRow);
        })
        .on('end', async () => {
          let processedCount = 0;
          let errorCount = 0;
          try {
            for (const row of rawRows) {
              const createTransactionDto = plainToInstance(CreateTransactionDto, {
                customerId: row.customerId,
                amountUsd: parseFloat(row.amountUsd),
              });
              const errors = await validate(createTransactionDto);
              if (errors.length > 0) {
                const errorMessages = errors.map(e => Object.values(e.constraints || {})).flat();
                return reject(new BadRequestException(errorMessages));
              }
              try {
                const transaction = await this.transactionRepository.create(createTransactionDto);
                processedCount++;
              } catch (error) {
                errorCount++;
              }
            };
            resolve({
              processed: processedCount,
              errors: errorCount,
            });
          } catch (processError) {
            reject(processError);
          }

        })
        .on('error', (error) => {
          console.log(error);
          reject(new BadRequestException('Error reading CSV file'));
        });
    });
    return await processCsvPromise;

  }
}

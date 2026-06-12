import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransactionRepository } from './transaction.repository';

@Module({
  controllers: [TransactionController],
  providers: [
    { provide: 'ITransactionRepository', useClass: TransactionRepository },
    TransactionService,
  ],
  imports: [PrismaModule],
})
export class TransactionModule { }

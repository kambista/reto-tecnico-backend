import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TransactionModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}

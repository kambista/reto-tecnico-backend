import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export enum Currency {
  PEN = 'PEN',
  USD = 'USD',
}

export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
}

export class CreateExchangeDto {
  @ApiProperty({
    example: '123',
    description: 'Identificador del cliente',
  })
  @IsString()
  customerId!: string;

  @ApiProperty({
    example: 1000,
    description: 'Monto en USD a cambiar',
  })
  @IsPositive()
  @IsNumber()
  amountUsd!: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class ExchangeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  amountUsd!: number;

  @ApiProperty()
  amountPen!: number;

  @ApiProperty()
  exchangeRate!: number;

  @ApiProperty()
  status!: string;
}

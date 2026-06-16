import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export enum Currency {
  PEN = 'PEN',
  USD = 'USD',
}

export class CreateExchangeDto {
  @IsPositive()
  @IsNumber()
  amount!: number;

  @IsEnum(Currency)
  sourceCurrency!: Currency;

  @IsEnum(Currency)
  targetCurrency!: Currency;
}

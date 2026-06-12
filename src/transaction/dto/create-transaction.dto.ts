import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateTransactionDto {

    @IsNotEmpty()
    @IsString()
    customerId!: string;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1, { message: 'Amount must be greater than zero' })
    amountUsd!: number;
}

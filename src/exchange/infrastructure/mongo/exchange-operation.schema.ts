import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ExchangeOperationDocument {
  @Prop()
  amount!: number;

  @Prop()
  exchangeRate!: number;

  @Prop()
  convertedAmount!: number;

  @Prop()
  sourceCurrency!: string;

  @Prop()
  targetCurrency!: string;
}

export const ExchangeOperationSchema = SchemaFactory.createForClass(
  ExchangeOperationDocument,
);

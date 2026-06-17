import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ExchangeOperationDocument {
  @Prop({
    required: true,
    unique: true,
  })
  transactionId!: string;

  @Prop({
    required: true,
  })
  customerId!: string;

  @Prop({
    required: true,
  })
  exchangeRate!: number;

  @Prop({
    required: true,
  })
  amountUsd!: number;

  @Prop({
    required: true,
  })
  amountPen!: number;

  @Prop()
  status!: string;
}

export const ExchangeOperationSchema = SchemaFactory.createForClass(
  ExchangeOperationDocument,
);

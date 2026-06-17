import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    userId: { type: String, required: true },
    operationType: { type: String, required: true },
    exchangeRate: { type: Number, required: true },
    amountUsd: { type: Number, required: true },
    amountPen: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const TransactionBD = model("Transaction", schema);

export default TransactionBD;

import "../../../env";

import { Application } from "express";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import AppRouter from "../../../router";
import Server from "../../../server";

describe("Transaction Route E2E", () => {
  let app: Application;
  let mongoServer: MongoMemoryServer;

  let idTestTransaction: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const server = new Server(3000, AppRouter.routes);
    server.middlewares();
    app = server.app;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("Registrar una transacción", async () => {
    const url = "/api/v1/transaction";
    const body = {
      customerId: "507f1f77bcf86cd799439011",
      amountUsd: 100,
    };

    const response = await request(app).post(url).send(body).expect(201);

    expect(response.body).toHaveProperty("transactionId");
    expect(mongoose.Types.ObjectId.isValid(response.body.transactionId)).toBe(
      true,
    );
    expect(response.body.status).toBe("completed");
    expect(response.body.exchangeRate).toBe(3.75);
    expect(response.body.amountUsd).toBe(100);
    expect(response.body.amountPen).toBe(375);

    idTestTransaction = response.body.transactionId;
  });

  it("Registrar una transacción con datos inválidos", async () => {
    const url = "/api/v1/transaction";
    const body = {
      customerId: "invalid-id",
      amountUsd: -50,
    };

    const response = await request(app).post(url).send(body).expect(400);

    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toContain("customerId is not valid");
    expect(response.body.errors).toContain("amountUsd must be greater than 0");
  });

  it("Obtener una transacción", async () => {
    const url = `/api/v1/transaction/${idTestTransaction}`;

    const response = await request(app).get(url).expect(200);

    expect(response.body.transactionId).toBe(idTestTransaction);
    expect(response.body.status).toBe("completed");
    expect(response.body.exchangeRate).toBe(3.75);
    expect(response.body.amountUsd).toBe(100);
    expect(response.body.amountPen).toBe(375);
    expect(response.body.customerId).toBe("507f1f77bcf86cd799439011");
  });

  it("No existe la transacción", async () => {
    const url = `/api/v1/transaction/507f1f77bcf86cd799439012`;

    const response = await request(app).get(url).expect(404);

    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toContain("Transaction not found");
  });
});

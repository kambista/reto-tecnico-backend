import swaggerJSDoc, { Options } from "swagger-jsdoc";

import { ENVIRONMENT } from "./config/environment.config";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mi API con Express y TypeScript",
      version: "1.0.0",
      description: "Documentación de la API generada con Swagger",
    },
    servers: [
      {
        url: `http://localhost:${ENVIRONMENT.PORT}/api/v1`,
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      schemas: {
        TransactionOutput: {
          type: "object",
          properties: {
            transactionId: { type: "string" },
            customerId: { type: "string" },
            exchangeRate: { type: "number" },
            amountUsd: { type: "number" },
            amountPen: { type: "number" },
            status: { type: "string" },
          },
        },
        RegisterTransactionInput: {
          type: "object",
          required: ["customerId", "amountUsd"],
          properties: {
            customerId: { type: "string", description: "MongoDB ObjectId" },
            amountUsd: { type: "number" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            errors: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },

  apis: ["./src/features/**/presentation/route.ts", "./src/server.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

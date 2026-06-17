import "./env";

import Server from "./server";
import AppRouter from "./router";
import MongoConnect from "./shared/infrastructure/database/mongodb/mongo-connect";
import { ENVIRONMENT } from "./config/environment.config";

process.on("uncaughtException", (error) => {
  console.error("🔥 Excepción no capturada:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("⚠️  Promesa rechazada no manejada:", reason);
  process.exit(1);
});

const main = async () => {
  await MongoConnect.connect({
    mongoUri: ENVIRONMENT.MONGO_URI,
    dbName: ENVIRONMENT.DB_NAME,
  });

  const server = new Server(ENVIRONMENT.PORT, AppRouter.routes);
  server.middlewares();
  server.listen();
};

main().catch((error) => {
  console.error("Error starting the application:", error);
  process.exit(1);
});

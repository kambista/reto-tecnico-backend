import express, { Application, Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

import { errorHandler } from "./shared/infrastructure/error/error-handler";

export default class Server {
  public app: Application;
  private port: number;
  private routes: Router;

  constructor(port: number = 3000, routes: Router) {
    this.app = express();
    this.port = port;
    this.routes = routes;
  }

  public middlewares(): void {
    this.app.use(express.json());

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.app.use("/api/v1", this.routes);

    this.app.get("/health", (_req, res) => res.send("ok"));

    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

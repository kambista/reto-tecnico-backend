import { Router } from "express";

import TransactionRouter from "./features/transaction/presentation/route";

export default class AppRouter {
  static get routes() {
    const router = Router();

    router.use("/transaction", TransactionRouter.routes);

    return router;
  }
}

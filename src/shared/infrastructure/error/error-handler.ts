import { Request, Response } from "express";
import AppError from "./app-error";
import { ENVIRONMENT } from "../../../config/environment.config";

export const errorMiddleware = (fn: Function) => {
  return async (req: any, res: any, next: any) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: Function,
) => {
  if (err instanceof AppError) {
    const errors = Array.isArray(err.errors) ? err.errors : [err.message];
    res.status(err.statusCode).json({ success: false, errors });
    return;
  }

  if (ENVIRONMENT.NODE_ENV === "development") {
    const errors = err instanceof Error ? [err.message] : ["Unknown error"];
    res.status(500).json({ success: false, errors });
    return;
  }

  res.status(500).json({ success: false, errors: ["Internal Server Error"] });
};

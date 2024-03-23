/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Touch error...");
  return res.status(500).json({
    success: false,
    message: err.message || "Something broke!",
    error: err,
  });
};

export default globalErrorHandler;

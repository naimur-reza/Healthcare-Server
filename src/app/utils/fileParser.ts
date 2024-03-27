import { NextFunction, Request, Response } from "express";

export const parseFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if req.body.data exists and is not empty
    if (!req.body.data || req.body.data.trim() === "") {
      throw new Error("Empty or undefined data field");
    }

    // Parse req.body.data as JSON
    req.body = JSON.parse(req.body.data);

    next();
  } catch (error) {
    next(error);
  }
};

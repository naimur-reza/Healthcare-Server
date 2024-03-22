import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import appRouter from "./app/routes";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthcare server is running",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message || "Something broke!",
    error: err,
  });
  next();
});

app.use((req, res) => {
  res.json({
    success: false,
    message: "Route not found!",
  });
});

import express, { Application } from "express";
import cors from "cors";
import appRouter from "./app/routes";
import notFound from "./app/handlers/NotFoundHandler";
import globalErrorHandler from "./app/handlers/GlobalErrorHandler";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthcare server is running",
    data: null,
  });
});

//handling global app error
app.use(globalErrorHandler);
//handling not found route
app.use(notFound);

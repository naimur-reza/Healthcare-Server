import express, { Application } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthcare server is running",
  });
});

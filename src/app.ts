import express, { Application } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.routes";
import { adminRoutes } from "./app/modules/Admin/admin.routes";
export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Healthcare server is running",
  });
});

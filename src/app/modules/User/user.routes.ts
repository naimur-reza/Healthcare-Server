import { Router } from "express";
import { userControllers } from "./user.controllers";

const router = Router();

router.get("/", userControllers.getAllUsers);

router.post("/", userControllers.createAdmin);

export const userRoutes = router;

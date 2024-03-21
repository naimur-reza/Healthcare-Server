import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:id", AdminController.getSingleAdmin);

export const adminRoutes = router;

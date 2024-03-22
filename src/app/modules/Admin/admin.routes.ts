import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:id", AdminController.getSingleAdmin);

router.patch("/:id", AdminController.updateAdminData);

router.delete("/:id", AdminController.deleteAdminData);

router.delete("/soft/:id", AdminController.softAdminDelete);

export const adminRoutes = router;

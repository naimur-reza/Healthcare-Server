import { Router } from "express";
import { AdminController } from "./admin.controller";
import { adminValidation } from "./admin.validations";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get("/", AdminController.getAllAdmins);

router.get("/:id", AdminController.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(adminValidation.updateAdmin),
  AdminController.updateAdminData,
);

router.delete("/:id", AdminController.deleteAdminData);

router.delete("/soft/:id", AdminController.softAdminDelete);

export const adminRoutes = router;

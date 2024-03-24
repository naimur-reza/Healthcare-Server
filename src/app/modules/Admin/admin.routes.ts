import { Router } from "express";
import { AdminController } from "./admin.controller";
import { adminValidation } from "./admin.validations";
import validateRequest from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  AdminController.getAllAdmins,
);

router.get(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  AdminController.getSingleAdmin,
);

router.patch(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  validateRequest(adminValidation.updateAdmin),
  AdminController.updateAdminData,
);

router.delete(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  AdminController.deleteAdminData,
);

router.delete(
  "/soft/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  AdminController.softAdminDelete,
);

export const adminRoutes = router;

import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";

const router = Router();

router.post("/login", authController.userLogin);

router.post("/refresh-token", authController.refreshToken);

router.patch(
  "/change-password",
  checkAuth(
    userRole.ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT,
    userRole.SUPER_ADMIN,
  ),
  authController.changePassword,
);

export const authRoutes = router;

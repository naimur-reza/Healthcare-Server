import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/",
  checkAuth(userRole.PATIENT, userRole.SUPER_ADMIN, userRole.PATIENT),
  paymentController.initPayment,
);

export const paymentRoutes = router;

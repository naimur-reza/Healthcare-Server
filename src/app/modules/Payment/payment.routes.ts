import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { paymentController } from "./payment.controller";

const router = Router();

router.get(
  '/ipn',
  paymentController.validatePayment
)

router.post(
  "/init-payment/:appointmentId",
  checkAuth(userRole.PATIENT, userRole.SUPER_ADMIN, userRole.PATIENT),
  paymentController.initPayment,
);

export const paymentRoutes = router;

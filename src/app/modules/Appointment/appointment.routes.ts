import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";

const router = Router();

router.post(
  "/",
  checkAuth(userRole.PATIENT, userRole.SUPER_ADMIN),
  AppointmentController.createAppointment,
);

export const appointmentRoutes = router;

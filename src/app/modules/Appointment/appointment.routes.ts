import { Router } from "express";
import { userRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { AppointmentValidation } from "./appointment.validation";

const router = Router();

router.post(
  "/",
  checkAuth(userRole.PATIENT, userRole.SUPER_ADMIN),
  AppointmentController.createAppointment,
);

router.get(
  '/',
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  AppointmentController.getAllFromDB
);

router.get(
  '/my-appointment',
  checkAuth(userRole.PATIENT, userRole.DOCTOR),
  AppointmentController.getMyAppointment
)

router.post(
  '/',
  checkAuth(userRole.PATIENT),
  validateRequest(AppointmentValidation.createAppointment),
  AppointmentController.createAppointment
);

router.patch(
  '/status/:id',
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
  AppointmentController.changeAppointmentStatus
);




export const appointmentRoutes = router;

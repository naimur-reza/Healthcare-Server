import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";

const router = Router();

// Define your doctor schedule route here
router.post(
  "/",
  checkAuth(userRole.DOCTOR),
  doctorScheduleController.createDoctorSchedule,
);

export const doctorScheduleRoutes = router;

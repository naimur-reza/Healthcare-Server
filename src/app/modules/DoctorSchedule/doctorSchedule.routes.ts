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

router.get(
  "/my-schedule",
  checkAuth(userRole.DOCTOR),
  doctorScheduleController.getMySchedule,
);

router.delete(
  "/:id",
  checkAuth(userRole.DOCTOR),
  doctorScheduleController.deleteSchedule,
);

export const doctorScheduleRoutes = router;

import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";

const router = Router();

// Define your doctor schedule route here
router.post("/", doctorScheduleController.createDoctorSchedule);

export const doctorScheduleRoutes = router;

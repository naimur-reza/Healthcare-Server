import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { scheduleValidation } from "./schedule.validation";
import { userRole } from "@prisma/client";

const router = Router();

router.get("/", checkAuth(userRole.DOCTOR), scheduleController.getAllSchedule);

router.post(
  "/",
  checkAuth(userRole.DOCTOR),
  validateRequest(scheduleValidation.scheduleSchema),
  scheduleController.createSchedule,
);

export const scheduleRoutes = router;

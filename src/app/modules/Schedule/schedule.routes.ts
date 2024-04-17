import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { scheduleValidation } from "./schedule.validation";
import { userRole } from "@prisma/client";

const router = Router();

router.get("/", checkAuth(userRole.DOCTOR), scheduleController.getAllSchedule);

router.get("/:id", checkAuth(userRole.DOCTOR));

router.get(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
  scheduleController.getByIdFromDB,
);

router.post(
  "/",
  checkAuth(userRole.DOCTOR),
  validateRequest(scheduleValidation.scheduleSchema),
  scheduleController.createSchedule,
);

router.delete(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  scheduleController.deleteFromDB,
);

export const scheduleRoutes = router;

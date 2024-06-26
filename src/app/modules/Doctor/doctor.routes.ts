import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { DoctorController } from "./doctor.controller";
import { DoctorValidation } from "./doctor.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  DoctorController.getAllDoctors,
);

router.get(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  DoctorController.getSingleDoctor,
);

router.patch(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  validateRequest(DoctorValidation.updateDoctorSchema),
  DoctorController.updateDoctorData,
);

router.delete(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  DoctorController.deleteDoctorData,
);

router.delete(
  "/soft/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  DoctorController.softDoctorDelete,
);

export const doctorRoutes = router;

import { Router } from "express";
import { PatientController } from "./patient.controller";
import validateRequest from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { patientValidationSchema } from "./patient.validation";

const router = Router();

router.get(
  "/",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.getAllPatients,
);

router.get(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.getSinglePatient,
);

router.patch(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  validateRequest(patientValidationSchema.updatePatientSchema),
  PatientController.updatePatientData,
);

router.delete(
  "/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.deletePatientData,
);

router.delete(
  "/soft/:id",
  checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.softPatientDelete,
);

export const patientRoutes = router;

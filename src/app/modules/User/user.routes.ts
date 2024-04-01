import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { upload } from "../../helpers/fileUploader";
import { parseFile } from "../../utils/fileParser";

const router = Router();

router.get(
  "/",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN),
  userControllers.getAllUsers,
);

router.get(
  "/me",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  userControllers.getMyProfile,
);

router.post(
  "/create-admin",
  // checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN),
  upload.single("file"),
  parseFile,
  validateRequest(userValidation.adminSchema),
  userControllers.createAdmin,
);

router.post(
  "/create-doctor",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN),
  upload.single("file"),
  parseFile,
  validateRequest(userValidation.doctorSchema),
  userControllers.createDoctor,
);

router.post(
  "/create-patient",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  upload.single("file"),
  parseFile,
  validateRequest(userValidation.patientSchema),
  userControllers.createPatient,
);

router.patch("/:id/status", userControllers.updateUserStatus);

export const userRoutes = router;

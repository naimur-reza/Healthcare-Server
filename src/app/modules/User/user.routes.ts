import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { upload } from "../../helpers/fileUploader";
import { parseFile } from "../../utils/fileParser";

const router = Router();

router.get("/", userControllers.getAllUsers);

router.post(
  "/create-admin",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN),
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

export const userRoutes = router;

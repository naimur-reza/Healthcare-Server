import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { upload } from "../../helpers/fileUploader";
import { parseFile } from "../../utils/fileParser";
import { specialtiesController } from "./specialties.controller";

const router = Router();

router.get("/", checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN));

router.post(
  "/create-specialties",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  upload.single("file"),
  parseFile,
  specialtiesController.createSpecialties,
);

export const specialtiesRoute = router;

import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";
import { upload } from "../../helpers/fileUploader";
import { parseFile } from "../../utils/fileParser";
import { specialtiesController } from "./specialties.controller";

const router = Router();

router.get(
  "/",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN),
  specialtiesController.getAllSpecialties,
);

router.post(
  "/",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  upload.single("file"),
  parseFile,
  specialtiesController.createSpecialties,
);

router.delete(
  "/:id",
  checkAuth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),

  specialtiesController.deleteSpecialties,
);

export const specialtiesRoute = router;

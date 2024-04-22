import express from "express";
import { metaController } from "./meta.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  checkAuth(
    userRole.SUPER_ADMIN,
    userRole.ADMIN,
    userRole.DOCTOR,
    userRole.PATIENT,
  ),
  metaController.fetchDashboardMetaData,
);

export const metaRoutes = router;

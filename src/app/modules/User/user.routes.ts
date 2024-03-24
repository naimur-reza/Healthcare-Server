import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { userRole } from "@prisma/client";

const router = Router();

router.get("/", userControllers.getAllUsers);

router.post(
  "/",
  checkAuth(userRole.ADMIN),
  validateRequest(userValidation.createUserValidation),
  userControllers.createAdmin,
);

export const userRoutes = router;

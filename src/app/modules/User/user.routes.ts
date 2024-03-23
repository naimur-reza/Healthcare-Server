import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get("/", userControllers.getAllUsers);

router.post(
  "/",
  validateRequest(userValidation.createUserValidation),
  userControllers.createAdmin,
);

export const userRoutes = router;

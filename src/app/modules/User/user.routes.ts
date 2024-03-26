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
  "/",
  checkAuth(userRole.ADMIN),
  upload.single("file"),
  parseFile,
  validateRequest(userValidation.createUserValidation),
  userControllers.createAdmin,
);

export const userRoutes = router;

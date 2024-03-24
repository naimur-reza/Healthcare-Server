import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import verifyToken from "../../utils/verifyToken";
import { userRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const router = Router();

const checkAuth = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Error("Unauthorized access");

      const user = verifyToken(token);

      console.log(user);
      const isExistUser = await prisma.user.findUniqueOrThrow({
        where: {
          email: user.email,
          status: UserStatus.ACTIVE,
        },
      });

      const isValidRole = roles.some(role => role === isExistUser.role);

      if (!isValidRole) throw new Error("Unauthorized access");
      next();
    } catch (error) {
      next(error);
    }
  };
};

router.get("/", userControllers.getAllUsers);

router.post(
  "/",
  checkAuth("ADMIN"),
  validateRequest(userValidation.createUserValidation),
  userControllers.createAdmin,
);

export const userRoutes = router;

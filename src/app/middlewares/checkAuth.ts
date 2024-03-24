import { NextFunction, Request, Response } from "express";
import verifyToken from "../utils/verifyToken";
import { userRole, UserStatus } from "@prisma/client";
import prisma from "../shared/prisma";

export const checkAuth = (...roles: userRole[]) => {
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

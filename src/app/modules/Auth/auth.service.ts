import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";

const login = async (payload: { email: string; password: string }) => {
  console.log("User logging in...");

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const comparePassword = bcrypt.compareSync(
    payload.password,
    userData.password,
  );
  if (!comparePassword) throw new Error("Password does not matched!");

  const jwtPayload = {
    id: userData.id,
    email: userData.email,
  };

  const refreshToken = generateToken(jwtPayload);

  const token = generateToken(jwtPayload);

  return {
    userData,
    token,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const user = verifyToken(token);

  console.log(user);
  const isExistUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const payload = {
    id: isExistUser.id,
    email: isExistUser.email,
  };

  const newToken = generateToken(payload);

  return newToken;
};

export const authServices = {
  login,
  refreshToken,
};

import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";
import configs from "../../configs";
import GenericError from "../../errors/GenericError";
import { JwtPayload } from "jsonwebtoken";

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
    email: userData.email,
    role: userData.role,
  };

  const refreshToken = generateToken(
    jwtPayload,
    configs.jwt_refresh_secret!,
    configs.jwt_refresh_expires_in!,
  );

  const token = generateToken(
    jwtPayload,
    configs.jwt_secret!,
    configs.jwt_access_secret_expires_in!,
  );

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
    email: isExistUser.email,
    role: isExistUser.role,
  };

  const newToken = generateToken(
    payload,
    configs.jwt_secret!,
    configs.jwt_access_secret_expires_in!,
  );

  return newToken;
};

const changeUserPassword = async (
  user: JwtPayload,
  { newPassword, oldPassword }: { newPassword: string; oldPassword: string },
) => {
  const comparePassword = bcrypt.compareSync(oldPassword, user.password);
  if (!comparePassword) throw new GenericError(400, "Incorrect password!");

  const hashPassword = bcrypt.hashSync(newPassword, 10);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

export const authServices = {
  login,
  refreshToken,
  changeUserPassword,
};

import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import verifyToken from "../../utils/verifyToken";
import { UserStatus } from "@prisma/client";
import configs from "../../configs";
import GenericError from "../../errors/GenericError";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

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
  const user = verifyToken(token, configs.jwt_refresh_secret!);

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

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });

  const jwtPayload = {
    id: user.id,
    email: user.email,
  };
  const resetToken = generateToken(
    jwtPayload,
    configs.password_reset_token!,
    configs.reset_token_expires_in!,
  );

  const resetLink =
    configs.password_reset_link +
    `?id=${user.id}&email=${user.email}&resetToken=${resetToken}`;

  await sendEmail(
    user.email,
    `
  <div>
    <a href="${resetLink}">
      <button>
        Reset password
      </button> 
    </a>
  </div>
  `,
  );

  return null;
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string },
) => {
  const isValidToken = verifyToken(
    token,
    configs.password_reset_token!,
  ) as JwtPayload;
  if (!isValidToken) throw new GenericError(403, "Forbidden access");

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const hashPassword = bcrypt.hashSync(payload.password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashPassword,
    },
  });

  return { message: "Password reset successfully!" };
};

export const authServices = {
  login,
  refreshToken,
  changeUserPassword,
  forgotPassword,
  resetPassword,
};

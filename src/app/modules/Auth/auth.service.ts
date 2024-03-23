import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const login = async (payload: { email: string; password: string }) => {
  console.log("User logging in...");

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
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

  const token = jwt.sign(jwtPayload, "secret", {
    expiresIn: "5min",
  });

  return {
    userData,
    token,
  };
};

export const authServices = {
  login,
};

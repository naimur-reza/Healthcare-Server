import { userRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";

interface IUser {
  password: string;
  admin: {
    email: string;
  };
  role: userRole;
}

const getAllUsersFromDB = async () => {
  // const data = await prisma
};

const createAdmin = async (data: IUser) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.admin.email,
    password: hashPassword,
    role: userRole.ADMIN,
  };

  const res = await prisma.$transaction(async transaction => {
    await transaction.user.create({
      data: userData,
    });

    const createAdmin = await transaction.admin.create({
      data: data.admin,
    });

    return createAdmin;
  });

  return res;
};

export const userServices = {
  getAllUsersFromDB,
  createAdmin,
};

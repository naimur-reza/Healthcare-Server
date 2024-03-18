import { PrismaClient, userRole } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const getAllUsersFromDB = async () => {
  // const data = await prisma
};

const createAdmin = async data => {
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

import { Admin, userRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { sendImageToCloudinary } from "../../helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
interface IUser {
  password: string;
  admin: Admin;
  role: userRole;
}

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { status: UserStatus.ACTIVE },
    // select: { password: false },
  });
  return users;
};

const createAdmin = async (file: any, data: IUser) => {
  if (file) {
    const uploadFile = (await sendImageToCloudinary(
      file.originalname,
      file.path,
    )) as UploadApiResponse;
    data.admin.profilePhoto = uploadFile.secure_url;
  }

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

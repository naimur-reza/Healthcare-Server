import { userRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { sendImageToCloudinary } from "../../helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { IAdmin, IDoctor } from "./user.interface";

const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    where: { status: UserStatus.ACTIVE },
    // select: { password: false },
  });
  return users;
};

const createAdmin = async (file: any, data: IAdmin) => {
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

const createDoctor = async (file: any, data: IDoctor) => {
  if (file) {
    const uploadFile = (await sendImageToCloudinary(
      file.originalname,
      file.path,
    )) as UploadApiResponse;
    data.doctor.profilePhoto = uploadFile.secure_url;
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.doctor.email,
    password: hashPassword,
    role: userRole.DOCTOR,
  };

  const res = await prisma.$transaction(async transaction => {
    await transaction.user.create({
      data: userData,
    });

    const createDoctor = await transaction.doctor.create({
      data: data.doctor,
    });

    return createDoctor;
  });

  return res;
};

export const userServices = {
  getAllUsersFromDB,
  createAdmin,
  createDoctor,
};

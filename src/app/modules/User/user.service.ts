import { Prisma, userRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { sendImageToCloudinary } from "../../helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { IAdmin, IDoctor } from "./user.interface";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IOptions, IParams } from "../Admin/admin.interface";
import { userSearchAbleFields } from "./user.constant";

const getAllUsersFromDB = async (params: IParams, options: IOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, skip } = calculatePagination(options);

  const andOption: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andOption.push({
      OR: userSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andOption.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput =
    andOption.length > 0 ? { AND: andOption } : {};

  const data = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "asc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const meta = {
    page: Number(options.page) || 1,
    limit,
    total: data.length,
  };

  return { data, meta };
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

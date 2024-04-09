import { Prisma, userRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import { sendImageToCloudinary } from "../../helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { IAdmin, IDoctor, IPatient } from "./user.interface";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IParams } from "../Admin/admin.interface";
import { userSearchAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { IAuth, IOptions } from "../../interfaces/common";

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
    andOption.length > 0 ? { AND: andOption, status: "ACTIVE" } : {};

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
const createPatient = async (file: any, data: IPatient) => {
  if (file) {
    const uploadFile = (await sendImageToCloudinary(
      file.originalname,
      file.path,
    )) as UploadApiResponse;
    data.patient.profilePhoto = uploadFile.secure_url;
  }

  const hashPassword = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.patient.email,
    password: hashPassword,
    role: userRole.PATIENT,
  };

  const res = await prisma.$transaction(async transaction => {
    await transaction.user.create({
      data: userData,
    });

    const createPatient = await transaction.patient.create({
      data: data.patient,
    });

    return createPatient;
  });

  return res;
};

const updateStatus = async (id: string, status: UserStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  const update = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return update;
};

const getMyProfile = async (user: IAuth & JwtPayload) => {
  const role = user.role as userRole;

  let userData;

  if (role === userRole.ADMIN || userRole.SUPER_ADMIN) {
    userData = await prisma.admin.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (role === userRole.PATIENT) {
    userData = await prisma.patient.findUnique({
      where: {
        email: user.email,
      },
    });
  } else if (role === userRole.DOCTOR) {
    userData = await prisma.doctor.findUnique({
      where: {
        email: user.email,
      },
    });
  }

  return { ...userData, password: undefined };
};

const updateMyProfile = async (file: any, user: JwtPayload, payload: any) => {
  if (file) {
    const uploadFile = (await sendImageToCloudinary(
      file.originalname,
      file.path,
    )) as UploadApiResponse;
    payload.profilePhoto = uploadFile.secure_url;
  }

  const role = user.role as userRole;

  let userData;

  if (role === userRole.ADMIN || userRole.SUPER_ADMIN) {
    userData = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (role === userRole.PATIENT) {
    userData = await prisma.patient.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (role === userRole.DOCTOR) {
    userData = await prisma.doctor.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  }

  return { ...userData, password: undefined };
};

export const userServices = {
  getAllUsersFromDB,
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus,
  getMyProfile,
  updateMyProfile,
};

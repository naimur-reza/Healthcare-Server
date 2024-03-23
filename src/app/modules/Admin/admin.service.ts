import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { searchableFields } from "./admin.constant";
import { IOptions, calculatePagination } from "../../helpers/paginationHelper";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllAdminsFormDB = async (
  params: Record<string, unknown>,
  options: IOptions,
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, skip } = calculatePagination(options);

  const andOption: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andOption.push({
      OR: searchableFields.map(field => ({
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
          equals: filterData[key],
        },
      })),
    });
  }

  const whereOption: Prisma.AdminWhereInput = {
    AND: andOption,
    isDeleted: false,
  };

  const data = await prisma.admin.findMany({
    where: whereOption,
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
  });

  const meta = {
    page: Number(options.page) || 1,
    limit,
    total: data.length,
  };

  return { data, meta };
};

const getSingleDataFromDB = async (id: string): Promise<Admin | null> => {
  const data = await prisma.admin.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return data;
};

const updateAdminDataIntoDB = async (
  id: string,
  data: Partial<Admin>,
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedData = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data: data,
  });

  return updatedData;
};

const deleteDataFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const admin = await transaction.admin.delete({
      where: {
        id,
      },
    });
    await transaction.user.delete({
      where: {
        email: admin.email,
      },
    });
    return admin;
  });

  return deletedData;
};
const softDeleteDataFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const admin = await transaction.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transaction.user.update({
      where: {
        email: admin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return admin;
  });

  return deletedData;
};

export const AdminService = {
  getAllAdminsFormDB,
  getSingleDataFromDB,
  updateAdminDataIntoDB,
  deleteDataFromDB,
  softDeleteDataFromDB,
};

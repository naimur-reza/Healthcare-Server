import { Prisma, PrismaClient } from "@prisma/client";
import { searchableFields } from "./admin.constant";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllAdminsFormDB = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit } = options;

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

  const whereOption: Prisma.AdminWhereInput = { AND: andOption };

  const data = await prisma.admin.findMany({
    where: whereOption,
    skip: Number(page - 1) * Number(limit),
    take: Number(limit),
  });

  return data;
};

export const AdminService = { getAllAdminsFormDB };

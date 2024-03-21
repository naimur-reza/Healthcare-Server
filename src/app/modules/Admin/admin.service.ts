import { Prisma, PrismaClient } from "@prisma/client";
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

  const whereOption: Prisma.AdminWhereInput = { AND: andOption };

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

const getSingleDataFromDB = async (id: string) => {
  const data = await prisma.admin.findUnique({
    where: {
      id: id,
    },
  });

  return data;
};

export const AdminService = { getAllAdminsFormDB, getSingleDataFromDB };

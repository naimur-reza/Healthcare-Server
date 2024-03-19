import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllAdminsFormDB = async (params: any) => {
  const andOption: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andOption.push({
      OR: ["name", "email"].map(field => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const whereOption: Prisma.AdminWhereInput = { AND: andOption };

  const data = await prisma.admin.findMany({
    where: whereOption,
  });

  return data;
};

export const AdminService = { getAllAdminsFormDB };

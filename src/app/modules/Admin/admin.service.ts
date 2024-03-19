import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllAdminsFormDB = async (params: any) => {
  const data = await prisma.admin.findMany({
    where: {
      name: {
        contains: params.searchTerm,
        mode: "insensitive",
      },
    },
  });

  return data;
};

export const AdminService = { getAllAdminsFormDB };

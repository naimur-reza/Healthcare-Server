import { Patient, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IOptions } from "../../interfaces/common";
import { IParams } from "./patient.interface";
import { patientSearchableFields } from "./patient.constant";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllPatientsFormDB = async (params: IParams, options: IOptions) => {
  const { searchTerm, ...filterData } = params;
  const { limit, skip } = calculatePagination(options);

  const andOption: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andOption.push({
      OR: patientSearchableFields.map(field => ({
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

  const whereOption: Prisma.PatientWhereInput = {
    AND: andOption,
    isDeleted: false,
  };

  const data = await prisma.patient.findMany({
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

const getSingleDataFromDB = async (id: string): Promise<Patient | null> => {
  const data = await prisma.patient.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return data;
};

const updatePatientDataIntoDB = async (
  id: string,
  data: Partial<Patient>,
): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedData = await prisma.patient.update({
    where: {
      id,
      isDeleted: false,
    },
    data: data,
  });

  return updatedData;
};

const deleteDataFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const Patient = await transaction.patient.delete({
      where: {
        id,
      },
    });
    await transaction.user.delete({
      where: {
        email: Patient.email,
      },
    });
    return Patient;
  });

  return deletedData;
};
const softDeleteDataFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const patient = await transaction.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transaction.user.update({
      where: {
        email: patient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return patient;
  });

  return deletedData;
};

export const PatientService = {
  getAllPatientsFormDB,
  getSingleDataFromDB,
  updatePatientDataIntoDB,
  deleteDataFromDB,
  softDeleteDataFromDB,
};

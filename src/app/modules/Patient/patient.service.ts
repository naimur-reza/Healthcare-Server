import { Patient, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IOptions } from "../../interfaces/common";
import { IParams, TPatient } from "./patient.interface";
import { patientSearchableFields } from "./patient.constant";

const prisma = new PrismaClient();

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
    include: {
      medicalReport: true,
      patientHealthData: true,
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
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });

  return data;
};

const updatePatientDataIntoDB = async (
  id: string,
  payload: Partial<TPatient>,
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientInfo } = payload;

  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async transactionClient => {
    await transactionClient.patient.update({
      where: {
        id,
        isDeleted: false,
      },
      data: patientInfo,
    });

    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patient.id,
        },
        update: patientHealthData,
        create: {
          patientId: patient.id,
          ...patientHealthData,
        },
      });
    }

    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: {
          patientId: patient.id,
          ...medicalReport,
        },
      });
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      id: patient.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
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
      include: {
        medicalReport: true,
        patientHealthData: true,
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

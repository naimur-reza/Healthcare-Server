import { Doctor, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { doctorSearchableFields } from "./doctor.constant";
import { calculatePagination } from "../../helpers/paginationHelper";
import { IDoctorFilterRequest, TDoctor } from "./doctor.interface";
import { IOptions } from "../../interfaces/common";

const prisma = new PrismaClient();

export interface SearchParams {
  searchTerm: string;
}

const getAllDoctorsFormDB = async (
  params: IDoctorFilterRequest,
  options: IOptions,
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, skip } = calculatePagination(options);

  const andOption: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andOption.push({
      OR: doctorSearchableFields.map(field => ({
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

  const whereOption: Prisma.DoctorWhereInput = {
    AND: andOption,
    isDeleted: false,
  };

  const data = await prisma.doctor.findMany({
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

const getSingleDataFromDB = async (id: string): Promise<Doctor | null> => {
  const data = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return data;
};

const updateDoctorDataIntoDB = async (
  id: string,
  payload: Partial<TDoctor>,
) => {
  const { specialties, ...doctorData } = payload;

  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async transaction => {
    const doctorInfo = await transaction.doctor.update({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        doctorSpecialties: true,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesIds = specialties.filter(
        specialty => specialty.isDeleted,
      );

      console.log(deleteSpecialtiesIds);
      for (const specialty of deleteSpecialtiesIds) {
        await transaction.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      const createSpecialtiesIds = specialties.filter(
        specialty => !specialty.isDeleted,
      );

      console.log(createSpecialtiesIds);

      for (const specialty of createSpecialtiesIds) {
        await transaction.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const deleteDataFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const Doctor = await transaction.doctor.delete({
      where: {
        id,
      },
    });
    await transaction.user.delete({
      where: {
        email: Doctor.email,
      },
    });
    return Doctor;
  });

  return deletedData;
};
const softDeleteDataFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deletedData = await prisma.$transaction(async transaction => {
    const Doctor = await transaction.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transaction.user.update({
      where: {
        email: Doctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return Doctor;
  });

  return deletedData;
};

export const DoctorService = {
  getAllDoctorsFormDB,
  getSingleDataFromDB,
  updateDoctorDataIntoDB,
  deleteDataFromDB,
  softDeleteDataFromDB,
};

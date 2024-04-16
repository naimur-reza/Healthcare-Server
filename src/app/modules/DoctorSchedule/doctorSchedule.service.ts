import { Prisma } from "@prisma/client";
import { IOptions, IUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import { calculatePagination } from "../../helpers/paginationHelper";
import GenericError from "../../errors/GenericError";
import { IDoctorScheduleFilterRequest } from "./doctorSchedule.interface";
// import { IParams } from "./doctorSchedule.interface";

const createDoctorSchedule = async (
  user: IUser,
  payload: { scheduleIds: string[] },
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorSchedulesData = payload.scheduleIds.map(scheduleId => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorSchedulesData,
  });

  return result;
};

const getMySchedule = async (params: any, options: IOptions) => {
  const { startDate, endDate, ...filterData } = params;

  const { limit, skip } = calculatePagination(options);

  if (typeof filterData.isBooked === "string") {
    filterData.isBooked = filterData.isBooked === "true";
  }

  const andCondition: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  Object.keys(filterData).forEach(key => {
    andCondition.push({
      [key]: { equals: filterData[key] },
    });
  });

  const whereCondition: Prisma.DoctorScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  console.log(andCondition);

  const result = await prisma.doctorSchedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });

  const meta = {
    page: Number(options.page) || 1,
    limit,
    total: result.length,
  };

  return {
    meta,
    result,
  };
};

const deleteFromDB = async (user: IUser, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId: doctorData.id,
      scheduleId: scheduleId,
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new GenericError(
      401,
      "You can not delete the schedule because of the schedule is already booked!",
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: IOptions,
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedule.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const doctorScheduleService = {
  createDoctorSchedule,
  getMySchedule,
  getAllFromDB,
  deleteFromDB,
};

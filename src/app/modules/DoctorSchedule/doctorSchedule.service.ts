import { Prisma } from "@prisma/client";
import { IOptions, IUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import { calculatePagination } from "../../helpers/paginationHelper";
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

const getAllFromDB = async (params: any, options: IOptions, user: IUser) => {
  const { startDate, endDate } = params;

  const { limit, skip } = calculatePagination(options);

  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });

  const doctorSchedulesId = doctorSchedules.map(item => item.scheduleId);

  const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.schedule.findMany({
    where: {
      ...whereCondition,
      id: { notIn: doctorSchedulesId },
    },
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

  console.log(doctorSchedules);

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

export const doctorScheduleService = {
  createDoctorSchedule,
  getAllFromDB,
};

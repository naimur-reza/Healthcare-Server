import { Prisma, Schedule } from "@prisma/client";
import { calculatePagination } from "../../helpers/paginationHelper";
import prisma from "../../shared/prisma";
import { ISchedule } from "./schedule.interface";
import { addHours, addMinutes, format } from "date-fns";
import { IOptions, IUser } from "../../interfaces/common";
import { IParams } from "../DoctorSchedule/schedule.interface";

const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const insertIntoDB = async (payload: ISchedule) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, intervalTime));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getAllFromDB = async (
  params: IParams,
  options: IOptions,
  user: IUser,
) => {
  const { startDate, endDate } = params;
  console.log(params);
  const { limit, skip } = calculatePagination(options);

  const andCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    console.log(startDate, endDate);
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

  const whereCondition: Prisma.ScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.schedule.findMany({
    where: whereCondition,
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
    total: result.length,
  };

  return {
    meta,
    result,
  };
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Schedule> => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const scheduleService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
};

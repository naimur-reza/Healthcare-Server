import { IUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";

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

export const doctorScheduleService = {
  createDoctorSchedule,
};

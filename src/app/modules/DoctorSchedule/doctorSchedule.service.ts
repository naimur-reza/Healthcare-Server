import { IUser } from "../../interfaces/common";

const createDoctorSchedule = async (user: IUser, payload: any) => {
  const result = console.log(payload);

  return result;
};

export const doctorScheduleService = {
  createDoctorSchedule,
};

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await doctorScheduleService.createDoctorSchedule(
    user,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor schedule created successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
};

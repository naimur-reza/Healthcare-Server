import { pick } from "../../shared/pick";
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

const getAllSchedule = catchAsync(async (req, res) => {
  const filterParams = pick(req.query, [""]);
  const options = pick(req.query, ["limit", "sortBy", "sortOrder", "page"]);
  const user = req.user;

  const { result, meta } = await doctorScheduleService.getAllFromDB(
    filterParams,
    options,
    user,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedules retrieved successfully!",
    meta,
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
  getAllSchedule,
};

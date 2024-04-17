import { pick } from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorScheduleService } from "./doctorSchedule.service";

const getAllFromDB = catchAsync(async (req, res) => {
  const filterParams = pick(req.query, ["searchTerm", "isBooked", "doctorId"]);
  const options = pick(req.query, ["limit", "sortBy", "sortOrder", "page"]);

  const { result, meta } = await doctorScheduleService.getMySchedule(
    filterParams,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedules retrieved successfully!",
    meta,
    data: result,
  });
});

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

const getMySchedule = catchAsync(async (req, res) => {
  const filterParams = pick(req.query, ["startDate", "endDate", "isBooked"]);
  const options = pick(req.query, ["limit", "sortBy", "sortOrder", "page"]);

  const { result, meta } = await doctorScheduleService.getMySchedule(
    filterParams,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My schedules retrieved successfully!",
    meta,
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req, res) => {
  const result = await doctorScheduleService.deleteFromDB(
    req.user,
    req.params.scheduleId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My schedules retrieved successfully!",
    data: result,
  });
});

export const doctorScheduleController = {
  createDoctorSchedule,
  getMySchedule,
  deleteSchedule,
  getAllFromDB,
};

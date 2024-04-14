import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import { pick } from "../../shared/pick";
import { scheduleFilterableFields } from "./schedule.constant";

const createSchedule = async (req: Request, res: Response) => {
  const patient = await scheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule created successfully!",
    data: patient,
  });
};

const getAllSchedule = async (req: Request, res: Response) => {
  const filterParams = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "sortBy", "sortOrder", "page"]);
  const user = req.user;

  const { result, meta } = await scheduleService.getAllFromDB(
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
};

export const scheduleController = {
  createSchedule,
  getAllSchedule,
};

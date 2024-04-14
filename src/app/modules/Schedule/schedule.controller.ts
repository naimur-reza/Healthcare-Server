import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";
import { pick } from "../../shared/pick";

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
  const filter = pick(req.query, ["startDateTime, endDateTime"]);
  const options = pick(req.query, ["limit", "sortBy", "sortOrder", "page"]);

  const { result, meta } = await scheduleService.getAllFromDB(filter, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule retrieved successfully!",
    meta,
    data: result,
  });
};

export const scheduleController = {
  createSchedule,
  getAllSchedule,
};

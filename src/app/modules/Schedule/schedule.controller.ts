import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { scheduleService } from "./schedule.service";

const createSchedule = async (req: Request, res: Response) => {
  const patient = await scheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Schedule created successfully!",
    data: patient,
  });
};

export const scheduleController = {
  createSchedule,
};

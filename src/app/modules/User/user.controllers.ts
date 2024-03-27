import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data: users,
  });
});

const createAdmin = async (req: Request, res: Response) => {
  const admin = await userServices.createAdmin(req.file, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin created successfully!",
    data: admin,
  });
};

const createDoctor = async (req: Request, res: Response) => {
  const doctor = await userServices.createDoctor(req.file, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor created successfully!",
    data: doctor,
  });
};

export const userControllers = {
  getAllUsers,
  createAdmin,
  createDoctor,
};

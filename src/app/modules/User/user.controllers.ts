import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { pick } from "../../shared/pick";
import { userFilterableFields } from "./user.constant";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const { data, meta } = await userServices.getAllUsersFromDB(filter, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    data,
    meta,
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

const createPatient = async (req: Request, res: Response) => {
  const patient = await userServices.createPatient(req.file, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient created successfully!",
    data: patient,
  });
};

const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await userServices.updateStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status successfully!",
    data: result,
  });
};

export const userControllers = {
  getAllUsers,
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
};

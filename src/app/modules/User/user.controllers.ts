import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await userServices.getAllUsersFromDB();
  res.send({
    success: true,
    data: users,
  });
};

const createAdmin = async (req: Request, res: Response) => {
  const admin = await userServices.createAdmin(req.body);
  res.send({
    success: true,
    data: admin,
  });
};

export const userControllers = {
  getAllUsers,
  createAdmin,
};

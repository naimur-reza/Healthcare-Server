import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdminsFormDB(req.query);

  res.status(200).send({
    success: true,
    message: "Admins retrieved successfully!",
    data: result,
  });
};

export const AdminController = { getAllAdmins };

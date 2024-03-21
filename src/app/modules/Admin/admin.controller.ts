/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import { pick } from "../../shared/pick";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await AdminService.getAllAdminsFormDB(filter, options);

    res.status(200).send({
      success: true,
      message: "Admins retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(400).send({
      success: true,
      message: error.message || "Something went wrong!",
      data: null,
    });
  }
};

export const AdminController = { getAllAdmins };

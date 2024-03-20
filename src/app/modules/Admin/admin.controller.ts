/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmins = async (req: Request, res: Response) => {
  const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    fields: K[],
  ) => {
    const finalObj: Partial<T> = {};
    for (const key of fields) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        finalObj[key] = obj[key];
      }
    }
    return finalObj;
  };

  try {
    const filter = pick(req.query, adminFilterableFields);

    const result = await AdminService.getAllAdminsFormDB(filter);

    res.status(200).send({
      success: true,
      message: "Admins retrieved successfully!",
      data: result,
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

import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { specialtiesServices } from "./specialties.service";

const createSpecialties = async (req: Request, res: Response) => {
  const specialties = await specialtiesServices.addSpecialtiesIntoDB(
    req.file,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties created successfully!",
    data: specialties,
  });
};

const getAllSpecialties = async (req: Request, res: Response) => {
  const specialties = await specialtiesServices.getAllSpecialtiesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties retrieved successfully!",
    data: specialties,
  });
};

const deleteSpecialties = async (req: Request, res: Response) => {
  const id = req.params.id;

  const specialties = await specialtiesServices.deleteSpecialtiesFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties retrieved successfully!",
    data: specialties,
  });
};

export const specialtiesController = {
  createSpecialties,
  getAllSpecialties,
  deleteSpecialties,
};

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

export const specialtiesController = {
  createSpecialties,
};

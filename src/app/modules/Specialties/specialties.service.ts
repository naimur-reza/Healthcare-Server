import { UploadApiResponse } from "cloudinary";
import { sendImageToCloudinary } from "../../helpers/fileUploader";
import prisma from "../../shared/prisma";
import { Specialties } from "@prisma/client";

const addSpecialtiesIntoDB = async (file: any, payload: Specialties) => {
  if (file) {
    const uploadFile = (await sendImageToCloudinary(
      file.originalname,
      file.path,
    )) as UploadApiResponse;

    payload.icon = uploadFile.secure_url;
  }

  const result = await prisma.specialties.create({
    data: payload,
  });
  return result;
};

const getAllSpecialtiesFromDB = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const deleteSpecialtiesFromDB = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });

  return result;
};

export const specialtiesServices = {
  addSpecialtiesIntoDB,
  getAllSpecialtiesFromDB,
  deleteSpecialtiesFromDB,
};

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

export const specialtiesServices = {
  addSpecialtiesIntoDB,
};

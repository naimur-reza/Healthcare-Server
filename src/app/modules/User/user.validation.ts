import { z } from "zod";

const adminSchema = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.string(),
      email: z.string(),
    }),
  }),
});

const doctorGenderEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);

const doctorSchema = z.object({
  body: z.object({
    password: z.string(),
    doctor: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      profilePhoto: z.string().optional(),
      contactNumber: z.string(),
      registrationNumber: z.string(),
      experience: z.number().optional(),
      gender: doctorGenderEnum,
      appointmentFee: z.number(),
      qualification: z.string(),
      currentWorkingPlace: z.string(),
      designation: z.string(),
      isDeleted: z.boolean(),
      averageRating: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
});

export const userValidation = {
  adminSchema,
  doctorSchema,
};

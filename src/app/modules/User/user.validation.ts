import { z } from "zod";

const adminSchema = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.string(),
      email: z.string(),
      contactNumber: z.string(),
    }),
  }),
});

const doctorGenderEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);

const doctorSchema = z.object({
  body: z.object({
    password: z.string(),
    doctor: z.object({
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
      averageRating: z.number(),
    }),
  }),
});

const patientSchema = z.object({
  body: z.object({
    password: z.string(),
    patient: z.object({
      email: z
        .string({
          required_error: "Email is required!",
        })
        .email(),
      name: z.string({
        required_error: "Name is required!",
      }),
      contactNumber: z.string({
        required_error: "Contact number is required!",
      }),
      address: z.string({
        required_error: "Address is required",
      }),
    }),
  }),
});

export const userValidation = {
  adminSchema,
  doctorSchema,
  patientSchema,
};

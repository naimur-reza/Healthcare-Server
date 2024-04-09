import { object, string } from "zod";

const updatePatientSchema = object({
  body: object({
    name: string().optional(),
    contactNumber: string().optional(),
    address: string().optional(),
  }),
});

export const patientValidationSchema = {
  updatePatientSchema,
};

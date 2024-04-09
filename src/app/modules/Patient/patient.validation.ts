import { boolean, object, string } from "zod";

const updatePatientHealthDataSchema = object({
  gender: string().optional(),
  dateOfBirth: string().optional(),
  bloodGroup: string().optional(),
  hasAllergies: boolean().optional(),
  hasDiabetes: boolean().optional(),
  height: string().optional(),
  weight: string().optional(),
  smokingStatus: boolean().optional(),
  dietaryPreferences: string().optional(),
  pregnancyStatus: boolean().optional(),
  mentalHealthHistory: string().optional(),
  immunizationStatus: string().optional(),
  hasPastSurgeries: boolean().optional(),
  recentAnxiety: boolean().optional(),
  recentDepression: boolean().optional(),
  maritalStatus: string().optional(),
});

const updateMedicalReportSchema = object({
  reportName: string().optional(),
  reportLink: string().optional(),
});

const updatePatientSchema = object({
  body: object({
    name: string().optional(),
    contactNumber: string().optional(),
    address: string().optional(),
    medicalReport: updateMedicalReportSchema.optional(),
    patientHealthData: updatePatientHealthDataSchema.optional(),
  }),
});

export const patientValidationSchema = {
  updatePatientSchema,
};

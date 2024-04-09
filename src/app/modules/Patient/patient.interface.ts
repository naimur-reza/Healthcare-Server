import { MedicalReport, PatientHealthData } from "@prisma/client";

export interface IParams {
  name?: string;
  email?: string;
  searchTerm?: string;
}

interface IPatient {
  name: string;
  address: string;
  contactNumber: string;
}

export type TPatient = IPatient & {
  patientHealthData: Omit<PatientHealthData, "patientId">;
  medicalReport: Omit<MedicalReport, "patientId">;
};

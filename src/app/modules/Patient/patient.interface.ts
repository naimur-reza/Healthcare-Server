import { Patient } from "@prisma/client";

export interface IParams {
  name?: string;
  email?: string;
  searchTerm?: string;
}

export type TPatient = Patient;

// {
//   patientHealthData?: Pick<PatientHealthData, "updatedAt">;
//   medicalReport?: Pick<MedicalReport, 'patientId'>;
// };

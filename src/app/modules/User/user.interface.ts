import { Admin, Doctor, Patient } from "@prisma/client";

export interface IAdmin {
  password: string;
  admin: Admin;
}

export interface IDoctor {
  password: string;
  doctor: Doctor;
}

export interface IPatient {
  password: string;
  patient: Patient;
}

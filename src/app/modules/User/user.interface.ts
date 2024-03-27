import { Admin, Doctor } from "@prisma/client";

export interface IAdmin {
  password: string;
  admin: Admin;
}

export interface IDoctor {
  password: string;
  doctor: Doctor;
}

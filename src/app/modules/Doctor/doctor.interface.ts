import { Doctor } from "@prisma/client";

export type ISpecialties = {
  specialtiesId: string;
  isDeleted?: null;
};

export type IDoctorFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  specialties?: string | undefined;
};

export type TDoctor = Doctor & {
  specialties: {
    specialtiesId: string;
    isDeleted?: boolean;
  }[];
};

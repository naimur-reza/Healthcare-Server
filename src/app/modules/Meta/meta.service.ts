import { userRole } from "@prisma/client";
import { IUser } from "../../interfaces/common";

const fetchDashboardMetaData = async (user: IUser) => {
  let metaData;
  switch (user?.role) {
    case userRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case userRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case userRole.DOCTOR:
      metaData = getDoctorMetaData(user);
      break;
    case userRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role!");
  }

  return metaData;
};

const getSuperAdminMetaData = () => {
  return {
    title: "Super Admin Dashboard",
    description: "This is the super admin dashboard.",
  };
};

const getAdminMetaData = () => {
  return {
    title: "Admin Dashboard",
    description: "This is the admin dashboard.",
  };
};

const getDoctorMetaData = (user: IUser) => {
  return {
    title: "Doctor Dashboard",
    description: `This is the dashboard for Dr. ${user.name}.`,
  };
};

const getPatientMetaData = (user: IUser) => {
  return {
    title: "Patient Dashboard",
    description: `This is the dashboard for ${user.name}.`,
  };
};

export const metaService = {
  fetchDashboardMetaData,
};

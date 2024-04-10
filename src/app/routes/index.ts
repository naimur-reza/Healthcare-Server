import { Router } from "express";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { specialtiesRoute } from "../modules/Specialties/specialties.routes";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.routes";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";

const appRouter = Router();

const options = [
  {
    path: "/user",
    routes: userRoutes,
  },
  {
    path: "/admin",
    routes: adminRoutes,
  },
  {
    path: "/doctor",
    routes: doctorRoutes,
  },
  {
    path: "/patient",
    routes: patientRoutes,
  },
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/specialties",
    routes: specialtiesRoute,
  },
  {
    path: "/schedule",
    routes: scheduleRoutes,
  },
];

options.forEach(item => appRouter.use(item.path, item.routes));

export default appRouter;

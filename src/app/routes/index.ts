import { Router } from "express";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { userRoutes } from "../modules/User/user.routes";

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
];

options.forEach(item => appRouter.use(item.path, item.routes));

export default appRouter;

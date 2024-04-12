import { IUser } from "./common";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

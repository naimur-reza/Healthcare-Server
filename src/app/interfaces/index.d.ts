import { JwtPayload } from "jsonwebtoken";
import { IAuth } from "./common";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload & IAuth;
    }
  }
}

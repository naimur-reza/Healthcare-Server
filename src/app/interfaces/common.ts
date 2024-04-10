import { JwtPayload } from "jsonwebtoken";

export interface IUser extends JwtPayload {
  email: string;
  role: string;
}

export interface IOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

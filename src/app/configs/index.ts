import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_access_secret_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRES_IN,
};

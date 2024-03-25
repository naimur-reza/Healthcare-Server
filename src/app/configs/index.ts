import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_access_secret_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRES_IN,
  password_reset_link: process.env.PASSWORD_RESET_LINK,
  password_reset_token: process.env.PASSWORD_RESET_TOKEN,
  reset_token_expires_in: process.env.RESET_TOKEN_EXPIRES_IN,
  auth: {
    email_sender: process.env.EMAIL_SENDER,
    email_sender_password: process.env.EMAIL_SENDER_PASSWORD,
  },
};

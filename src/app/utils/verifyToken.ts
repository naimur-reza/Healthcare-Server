import jwt, { JwtPayload } from "jsonwebtoken";
import configs from "../configs";

const verifyToken = (token: string) => {
  const isValidToken = jwt.verify(token, configs.jwt_secret!) as JwtPayload;
  if (!isValidToken) throw new Error("Unauthorized access!");
  return isValidToken;
};

export default verifyToken;

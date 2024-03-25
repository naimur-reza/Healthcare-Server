import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  const isValidToken = jwt.verify(token, secret) as JwtPayload;
  if (!isValidToken) throw new Error("Unauthorized access!");
  return isValidToken;
};

export default verifyToken;

import jwt from "jsonwebtoken";

const generateToken = (payload: any, token: string, expires_in: string) => {
  return jwt.sign(payload, token, {
    algorithm: "HS256",
    expiresIn: expires_in,
  });
};

export default generateToken;

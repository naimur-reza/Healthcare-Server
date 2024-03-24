import jwt from "jsonwebtoken";
import configs from "../configs";

const generateToken = (payload: any) => {
  return jwt.sign(payload, configs.jwt_secret!, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
};

export default generateToken;

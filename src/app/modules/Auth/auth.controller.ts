import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const userLogin: RequestHandler = catchAsync(async (req, res) => {
  const { userData, token, refreshToken } = await authServices.login(req.body);

  res.cookie("refreshToken", refreshToken, {});

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successful",
    data: { userData, token },
  });
});

export const authController = {
  userLogin,
};

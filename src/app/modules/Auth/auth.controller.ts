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

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const token = await authServices.refreshToken(refreshToken);

  res.cookie("refreshToken", refreshToken, {});

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successful",
    data: { token },
  });
});

export const authController = {
  userLogin,
  refreshToken,
};

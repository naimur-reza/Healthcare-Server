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
    data: { ...userData, token },
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

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const { user } = req;
  const { newPassword, oldPassword } = req.body;

  const result = await authServices.changeUserPassword(user, {
    newPassword,
    oldPassword,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: { result },
  });
});

const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.body;

  const result = await authServices.forgotPassword({ email });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reset link sent!",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const { id, password } = req.body;

  const result = await authServices.resetPassword(token as string, {
    id,
    password,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

export const authController = {
  userLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};

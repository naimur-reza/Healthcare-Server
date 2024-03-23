import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const userLogin: RequestHandler = catchAsync(async (req, res) => {
  const loginUser = await authServices.login(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successful",
    data: loginUser,
  });
});

export const authController = {
  userLogin,
};

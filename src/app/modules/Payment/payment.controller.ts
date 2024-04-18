import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const result = await paymentService.initPayment();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment init!",
    data: result,
  });
});

export const paymentController = {
  initPayment,
};

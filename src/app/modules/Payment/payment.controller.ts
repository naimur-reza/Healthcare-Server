import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const result = await paymentService.initPayment(appointmentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment init!",
    data: result,
  });
});


const validatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.validatePayment(req.query);
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment validate successfully',
      data: result,
  });
});


export const paymentController = {
  initPayment,
  validatePayment
};

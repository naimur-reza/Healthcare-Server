import { Request } from "express";
import { appointmentFilterableFields } from "./appointment.constant";
import catchAsync from "../../utils/catchAsync";
import { pick } from "../../shared/pick";
import sendResponse from "../../utils/sendResponse";
import { appointmentService } from "./appointment.service";

const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await appointmentService.createAppointment(user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment booked successfully!",
    data: result,
  });
});

const getMyAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await appointmentService.getMyAppointment(
    user,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Appointment retrieve successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await appointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

// const changeAppointmentStatus = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   const user = req.user;

//   const result = await appointmentService.changeAppointmentStatus(
//     id,
//     status,
//     user,
//   );
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Appointment status changed successfully",
//     data: result,
//   });
// });

export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  getAllFromDB,
  // changeAppointmentStatus,
};

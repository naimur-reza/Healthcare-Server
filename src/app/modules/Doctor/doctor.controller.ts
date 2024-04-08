import { DoctorService } from "./doctor.service";
import { pick } from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";

const getAllDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const { data, meta } = await DoctorService.getAllDoctorsFormDB(
    filter,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieved successfully",
    data,
    meta,
  });
});
const getSingleDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.getSingleDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor retrieved successfully",
    data: result,
  });
});

const updateDoctorData = catchAsync(async (req, res) => {
  const result = await DoctorService.updateDoctorDataIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});
const deleteDoctorData = catchAsync(async (req, res) => {
  const result = await DoctorService.deleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});
const softDoctorDelete = catchAsync(async (req, res) => {
  const result = await DoctorService.softDeleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctors,
  getSingleDoctor,
  updateDoctorData,
  deleteDoctorData,
  softDoctorDelete,
};

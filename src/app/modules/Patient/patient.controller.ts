import { PatientService } from "./patient.service";
import { patientFilterableFields } from "./patient.constant";
import { pick } from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAllPatients = catchAsync(async (req, res) => {
  const filter = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const { data, meta } = await PatientService.getAllPatientsFormDB(
    filter,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient retrieved successfully",
    data,
    meta,
  });
});
const getSinglePatient = catchAsync(async (req, res) => {
  const result = await PatientService.getSingleDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient retrieved successfully",
    data: result,
  });
});

const updatePatientData = catchAsync(async (req, res) => {
  const result = await PatientService.updatePatientDataIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});
const deletePatientData = catchAsync(async (req, res) => {
  const result = await PatientService.deleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

const softPatientDelete = catchAsync(async (req, res) => {
  const result = await PatientService.softDeleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatients,
  getSinglePatient,
  updatePatientData,
  deletePatientData,
  softPatientDelete,
};

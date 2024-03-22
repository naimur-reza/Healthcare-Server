import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import { pick } from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getAllAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const { data, meta } = await AdminService.getAllAdminsFormDB(filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin retrieved successfully",
    data,
    meta,
  });
});
const getSingleAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.getSingleDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdminData = catchAsync(async (req, res) => {
  const result = await AdminService.updateAdminDataIntoDB(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});
const deleteAdminData = catchAsync(async (req, res) => {
  const result = await AdminService.deleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});
const softAdminDelete = catchAsync(async (req, res) => {
  const result = await AdminService.softDeleteDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdminData,
  deleteAdminData,
  softAdminDelete,
};

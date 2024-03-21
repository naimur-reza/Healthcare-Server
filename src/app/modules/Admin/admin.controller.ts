import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import { pick } from "../../shared/pick";
import catchAsync from "../../utils/catchAsync";

const getAllAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdminService.getAllAdminsFormDB(filter, options);

  res.status(200).send({
    success: true,
    message: "Admins retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});
export const AdminController = { getAllAdmins };

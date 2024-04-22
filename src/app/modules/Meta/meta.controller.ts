import sendResponse from "../../utils/sendResponse";
import { metaService } from "./meta.service";
import catchAsync from "../../utils/catchAsync";

const fetchDashboardMetaData = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await metaService.fetchDashboardMetaData(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Meta data retrieved successfully!",
    data: result,
  });
});

export const metaController = {
  fetchDashboardMetaData,
};

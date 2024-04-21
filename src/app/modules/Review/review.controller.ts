import { ReviewService } from "./review.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { pick } from "../../shared/pick";
import { reviewFilterableFields } from "./review.constants";

const insertIntoDB = catchAsync(async (req,res) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});

const getAllFromDB = catchAsync(async (req, res) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});


export const ReviewController = {
    insertIntoDB,
    getAllFromDB
}
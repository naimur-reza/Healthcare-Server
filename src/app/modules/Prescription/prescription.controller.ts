import { Request, Response } from 'express';
import { PrescriptionService } from './prescription.service';
import { prescriptionFilterableFields } from './prescription.constants';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { pick } from '../../shared/pick';

const insertIntoDB = catchAsync(async (req,res) => {
    const user = req.user;
    const result = await PrescriptionService.insertIntoDB(user , req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

const patientPrescription = catchAsync(async (req,res) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await PrescriptionService.patientPrescription(user , options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, prescriptionFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Prescriptions retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const PrescriptionController = {
    insertIntoDB,
    patientPrescription,
    getAllFromDB
};
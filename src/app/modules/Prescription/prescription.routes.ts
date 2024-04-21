import express from 'express';
import { PrescriptionController } from './prescription.controller';
import {checkAuth} from '../../middlewares/checkAuth';
import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validation';

const router = express.Router();

router.get(
    '/',
    checkAuth(userRole.SUPER_ADMIN, userRole.ADMIN),
    PrescriptionController.getAllFromDB
);

router.get(
    '/my-prescription',
    checkAuth(userRole.PATIENT),
    PrescriptionController.patientPrescription
)

router.post(
    '/',
    checkAuth(userRole.DOCTOR),
    validateRequest(PrescriptionValidation.create),
    PrescriptionController.insertIntoDB
)


export const prescriptionRoutes = router;
import express from 'express'
import { ReviewController } from './review.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { checkAuth } from '../../middlewares/checkAuth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get('/', ReviewController.getAllFromDB);

router.post(
    '/',
    checkAuth(userRole.PATIENT),
    validateRequest(ReviewValidation.create),
    ReviewController.insertIntoDB
);


export const reviewRoutes = router;
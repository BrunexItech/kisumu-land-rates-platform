import express from 'express';
import { getPayments, getArrearsData } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/arrears', getArrearsData);

export default router;
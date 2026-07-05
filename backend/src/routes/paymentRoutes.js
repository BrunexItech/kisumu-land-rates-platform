import express from 'express';
import { getPayments, getArrearsData, initiateMpesaPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/arrears', getArrearsData);
router.post('/mpesa', initiateMpesaPayment);

export default router;
import express from 'express';
import { getTenants, getTenantStats, createTenant } from '../controllers/tenantController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTenants);
router.get('/stats', getTenantStats);
router.post('/', authenticate, createTenant);

export default router;
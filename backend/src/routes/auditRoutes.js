import express from 'express';
import { getAuditFlags, getAuditStats, resolveFlag, generateBrief } from '../controllers/auditController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAuditFlags);
router.get('/stats', getAuditStats);
router.put('/:id/resolve', authenticate, authorize('County Administrator', 'Auditor'), resolveFlag);
router.get('/brief', authenticate, generateBrief);

export default router;
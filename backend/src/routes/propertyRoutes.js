import express from 'express';
import { 
  getProperties, 
  getProperty, 
  createProperty, 
  getDashboardData,
  getOwnerProperties
} from '../controllers/propertyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/dashboard', getDashboardData);
router.get('/owner', authenticate, getOwnerProperties);
router.get('/:id', getProperty);
router.post('/', authenticate, authorize('County Administrator', 'Revenue Officer', 'Field Enumerator'), createProperty);

export default router;
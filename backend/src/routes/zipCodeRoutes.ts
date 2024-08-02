// backend/src/routes/zipCodeDataRoutes.ts
import { Router } from 'express';
import { getZipCodes, getZipCode, getZipCodeFromFile } from '../controllers/zipCodeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/datafile/:zip', authenticate, getZipCodeFromFile); // Get data for all zip codes
router.get('/:zip', authenticate, getZipCode); // Get data for a specific zip code
router.get('/', authenticate, getZipCodes); // Get data for all zip codes

export default router;

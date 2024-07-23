// backend/src/routes/zipCodeDataRoutes.ts
import { Router } from 'express';
import { getZipCodeData, getAllZipCodeData, getZipCodeDataFromFile } from '../controllers/zipCodeDataController';

const router = Router();

router.get('/datafile/:zip', getZipCodeDataFromFile); // Get data for all zip codes
router.get('/:zip', getZipCodeData); // Get data for a specific zip code
router.get('/', getAllZipCodeData); // Get data for all zip codes

export default router;

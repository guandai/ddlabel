// backend/src/routes/packageRoutes.ts
import { Router } from 'express';
import {
	createPackage,
	getPackages,
	updatePackage,
	deletePackage,
	getPackage,
} from '../controllers/packageController';
import { authenticate } from '../middleware/auth';
import { importPackages, uploadMiddleware } from '../controllers/packageUploadController';
import { getCsvPackages } from '../controllers/packageCsvController';

const router = Router();

router.post('/', authenticate, createPackage);
router.get('/', authenticate, getPackages);
router.put('/:id', authenticate, updatePackage);
router.delete('/:id', authenticate, deletePackage);
router.get('/:id', authenticate, getPackage);
router.post('/import', authenticate, uploadMiddleware, importPackages);
router.post('/csv', authenticate, getCsvPackages);

export default router;

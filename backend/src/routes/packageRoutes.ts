// backend/src/routes/packageRoutes.ts
import { Router } from 'express';
import {
	addPackage,
	getPackages,
	updatePackage,
	deletePackage,
	getPackageDetails,
} from '../controllers/packageController';
import { authenticate } from '../middleware/auth';
import { importPackages, uploadMiddleware } from '../controllers/packageUploadController';

const router = Router();

router.post('/', authenticate, addPackage);
router.get('/', authenticate, getPackages);
router.put('/:id', authenticate, updatePackage);
router.delete('/:id', authenticate, deletePackage);
router.get('/:id', authenticate, getPackageDetails);
router.post('/import', authenticate, uploadMiddleware, importPackages);

export default router;

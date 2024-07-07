// backend/src/routes/package.ts
import { Router } from 'express';
import { addPackage, deletePackage, editPackage, getPackageDetails, getPackages, updatePackage } from '../controllers/packageController';

const router = Router();

router.post('/', addPackage);
router.delete('/:id', deletePackage);
router.put('/:id', updatePackage);
router.get('/:id', getPackageDetails);
router.get('/', getPackages);

export default router;

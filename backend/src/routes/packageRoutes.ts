// backend/src/routes/packageRoutes.ts
import { Router } from 'express';
import { addPackage, getPackages, updatePackage, deletePackage } from '../controllers/packageController';

const router = Router();

router.post('/', addPackage);
router.get('/', getPackages);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;

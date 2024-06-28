import { Router } from 'express';
import { addPackage, deletePackage, editPackage, getPackageDetails } from '../controllers/packageController';

const router = Router();

router.post('/', addPackage);
router.delete('/:id', deletePackage);
router.put('/:id', editPackage);
router.get('/:id', getPackageDetails);

export default router;

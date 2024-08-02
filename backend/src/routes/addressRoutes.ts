// backend/src/routes/addressRoutes.ts
import { Router } from 'express';
import { createAddress, getAddresses, getAddressById, updateAddress } from '../controllers/addressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createAddress);
router.get('/', authenticate, getAddresses);
router.get('/:id', authenticate, getAddressById);
router.put('/:id', authenticate, updateAddress);

export default router;

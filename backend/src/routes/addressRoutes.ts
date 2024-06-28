// backend/src/routes/addressRoutes.ts
import { Router } from 'express';
import { createAddress, getAddresses, getAddressById, updateAddress, deleteAddress } from '../controllers/addressController';

const router = Router();

router.post('/', createAddress);
router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;

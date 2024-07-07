// backend/src/routes/postalZoneRoutes.ts
import { Router } from 'express';
import { getPostalZones, getPostalZoneById } from '../controllers/postalZoneController';

const router = Router();

router.get('/', getPostalZones);
router.get('/:id', getPostalZoneById);

export default router;

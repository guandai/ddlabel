// backend/src/routes/postalZoneRoutes.ts
import { Router } from 'express';
import { getPostalZone, getZone } from '../controllers/postalZoneController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/get_postal_zone', authenticate, getPostalZone);
router.get('/get_zone', authenticate, getZone);

export default router;

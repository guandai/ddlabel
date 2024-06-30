// backend/src/routes/shippingRateRoutes.ts
import { Router } from 'express';
import { getShippingRates } from '../controllers/shippingRateController';

const router = Router();

router.get('/', getShippingRates);

export default router;

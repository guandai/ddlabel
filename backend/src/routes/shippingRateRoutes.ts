// backend/src/routes/shippingRateRoutes.ts
import { Router, Request, Response } from 'express';
import { getFullRate, getShippingRates } from '../controllers/shippingRateController';

const router = Router();

// router.get('/', getShippingRates);

router.get('/full-rate', getFullRate);

export default router;

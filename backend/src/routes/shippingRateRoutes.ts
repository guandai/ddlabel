// backend/src/routes/shippingRateRoutes.ts
import { Router, Request, Response } from 'express';
import { getSimpleRate, getFullRate, getShippingRates } from '../controllers/shippingRateController';

const router = Router();

router.get('/', getShippingRates);

router.get('/simple-rate', getSimpleRate);

router.get('/full-rate', getFullRate);

export default router;

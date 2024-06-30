// backend/src/routes/shippingRateRoutes.ts
import { Router, Request, Response } from 'express';
import { getRate, getCalculateRate, getShippingRates } from '../controllers/shippingRateController';

const router = Router();

router.get('/', getShippingRates);


router.get('/rate', getRate);

router.get('/calculate-rate', getCalculateRate);

export default router;

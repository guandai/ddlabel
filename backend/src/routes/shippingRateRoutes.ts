// backend/src/routes/shippingRateRoutes.ts
import { Router, Request, Response } from 'express';
import { getFullRate, getShippingRates } from '../controllers/shippingRateController';
import { authenticate } from '../middleware/auth';

const router = Router();

// router.get('/', getShippingRates);

router.get('/full-rate', authenticate, getFullRate);

export default router;

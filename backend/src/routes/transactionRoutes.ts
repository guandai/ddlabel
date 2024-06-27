// backend/src/routes/transactionRoutes.ts
import { Router } from 'express';
import { getTransactions } from '../controllers/transactionController';

const router = Router();

router.get('/', getTransactions);

export default router;

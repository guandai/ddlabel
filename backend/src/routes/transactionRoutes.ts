// backend/src/routes/transactionRoutes.ts
import { Router } from 'express';
import { getTransactionById, getTransactions } from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTransactions);
router.get('/:id', authenticate, getTransactionById);

export default router;

// backend/src/controllers/transactionController.ts
import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

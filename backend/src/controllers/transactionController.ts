// backend/src/controllers/transactionController.ts
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../types';
import { Op } from 'sequelize';
import { Package } from '../models/Package';
import { User } from '../models/User';
import { GetTransactionRes, GetTransactionsRes, ResponseAdv } from '@ddlabel/shared';

export const getTransactions = async (req: AuthRequest, res: ResponseAdv<GetTransactionsRes>) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const userId = req.user.id; 
  const search = req.query.search; // 
  try {
    const total = (await Transaction.count({ where: { userId } })) || 0;

    const whereCondition = search
    ? {
        userId,
        trackingNo: {
          [Op.like]: `%${search}%`,
        },
      }
    : {userId};

    const transactions = await Transaction.findAll({
      include: [
        { model: Package, as: 'package' },
        { model: User, as: 'user' },
      ],
      where: whereCondition,
      limit,
      offset,
    });
    return res.json({ total, transactions });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getTransactionById = async (req: AuthRequest, res: ResponseAdv<GetTransactionRes>) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        { model: Package, as: 'package' },
        { model: User, as: 'user' },
      ],
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
      return;
    }
    return res.json({transaction});
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

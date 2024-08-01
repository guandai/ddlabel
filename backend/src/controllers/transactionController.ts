// backend/src/controllers/transactionController.ts
import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../types';
import { Op } from 'sequelize';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { User } from '../models/User';

export const getTransactions = async (req: AuthRequest, res: Response) => {
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

    const packages = await Transaction.findAll({
      include: [
        { model: Package, as: 'fromAddress' },
        { model: Address, as: 'toAddress' },
        { model: User, as: 'user' },
      ],
      where: whereCondition,
      limit,
      offset,
    });
    res.json({ total, packages });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// backend/src/controllers/userController.ts
import { Request } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Address } from '../models/Address';
import logger from '../config/logger';
import { AuthRequest } from '../types';
import {
  AddressEnum,
  GetUserRes,
  GetUsersRes,
  LoginUserRes,
  RegisterUserReq,
  RegisterUserRes,
  ResponseAdv,
  SimpleRes,
  UpdateUserRes,
  UpdateUserReq,
} from '@ddlabel/shared';
import { aggregateError, notFound } from '../utils/errors';
import { Transaction } from '../models/Transaction';
import { Package } from '../models/Package';
import { getAddressesWhere, getQueryWhere, getRelationQuery } from './packageControllerUtil';

export const registerUser = async (req: Request, res: ResponseAdv<RegisterUserRes>) => {
  const { name, email, password, role, warehouseAddress }: RegisterUserReq = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role });
    warehouseAddress.userId = user.id;
    await Address.createWithInfo(warehouseAddress);
    return res.status(201).json({ success: true, userId: user.id });
  } catch (error: any) {
    logger.error(`Error in registerUser: ${error}`);
    return res.status(400).json({ message: aggregateError(error), error });
  }
};

export const loginUser = async (req: AuthRequest, res: ResponseAdv<LoginUserRes>) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'user email not exist' });
    }
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      return res.json({ token, userId: user.id, userRole: user.role });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    logger.error(`Error in loginUser: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

export const updateUserById = async (req: AuthRequest, res: ResponseAdv<UpdateUserRes>) => {
  const user = req.body as UpdateUserReq & { id: number };
  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      delete user.password;
    }

    await Address.updateWithInfo(user.warehouseAddress);
    const [affectedCount]: [affectedCount: number] = await User.update(user, { where: { id: user.id } });
    const result: UpdateUserRes = { success: affectedCount > 0 };

    return res.json(result);
  } catch (error: any) {
    logger.error(`Error in updateUserById: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req: AuthRequest, res: ResponseAdv<GetUsersRes>) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const where = getQueryWhere(req);
  const whereAddress = getAddressesWhere(req, AddressEnum.user);
  
  try {
    const rows = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      limit,
      offset,
      include: [
        { model: Address, 
          as: 'warehouseAddress', 
          attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'], 
          where: {...whereAddress,  addressType: AddressEnum.user } },
      ],
    });
    const total = rows.count;
    const users = rows.rows;
    return res.json({ users, total });
  } catch (error: any) {
    logger.error(`Error in getUsers: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: ResponseAdv<GetUserRes>) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        { model: Address, 
          as: 'warehouseAddress', 
          attributes: ['id', 'name', 'address1', 'address2', 'zip', 'state', 'email', 'phone'], 
          where: { addressType: AddressEnum.user } 
        },
        // { model: Transaction, as: 'transactions', limit: 10 },
        // { model: Package, as: 'packages', limit: 10 },
      ],
      where: { id: req.params.id }
    });
    if (!user) { return notFound(res, 'User (By Id)') };

    return res.json({ user });
  } catch (error: any) {
    logger.error(`Error in getUserById: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUserById = async (req: AuthRequest, res: ResponseAdv<SimpleRes>) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    await Address.destroy({ where: { userId: user.id, addressType: AddressEnum.user } });
    await User.destroy({ where: { id: user.id } });
    await Transaction.destroy({ where: { userId: user.id } });
    await Package.destroy({ where: { userId: user.id } });
    return res.json({ message: 'User deleted' });
  } catch (error: any) {
    logger.error(`Error in deleteUser: ${error}`);
    return res.status(400).json({ message: error.message });
  }
}

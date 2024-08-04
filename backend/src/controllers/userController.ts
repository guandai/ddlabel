// backend/src/controllers/userController.ts
import { Request } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Address } from '../models/Address';
import { AuthRequest } from '../types';
import logger from '../config/logger';
import { AddressAttributes, GetCurrentUserRes, GetUsersRes, LoginUserRes, RegisterUserReq, RegisterUserRes, ResponseAdv, UpdateCurrentUserRes, UpdateUserReq, UpdateUserRes, UserAttributes } from '@ddlabel/shared';
import { Optional } from 'sequelize';
import { aggregateError } from '../utils/errors';

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
      return res.json({ token, userId: user.id });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateCurrentUser = async (req: AuthRequest, res: ResponseAdv<UpdateCurrentUserRes>) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const user = req.body as UpdateUserReq & { id: number };
    user.id = req.user.id;

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
    return res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: ResponseAdv<GetCurrentUserRes>) => {
  const notFound = () => res.status(404).json({ message: 'User not found' });

  if (!req.user) { return notFound() };

  type UserWithAddress = Optional<UserAttributes, 'password'> & { warehouseAddress: AddressAttributes } | null;
  const user: UserWithAddress = await User.findOne({
    where: { id: req.user.id },
    attributes: ['id', 'name', 'email', 'role'],
    include: [
      { model: Address, as: 'warehouseAddress' },
    ],
  });

  if (!user) { return notFound() };

  return res.json({ user });
};

export const getUsers = async (req: AuthRequest, res: ResponseAdv<GetUsersRes>) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        { model: Address, as: 'warehouseAddress' },
      ],
    });
    return res.json({ users });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

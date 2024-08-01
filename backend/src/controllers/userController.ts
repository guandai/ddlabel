// backend/src/controllers/userController.ts
import { Request, Response, Errback } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Address } from '../models/Address';
import { AuthRequest } from '../types';
import logger from '../config/logger';
import { UserRegisterReq, UserUpdateReq } from '@ddlabel/shared';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, warehouseAddress }: UserRegisterReq = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name: '', email, password: hashedPassword, role });
    warehouseAddress.userId = user.id;
    await Address.createWithInfo(warehouseAddress);
    
    res.status(201).json({ success: true, userId: user.id });
  } catch (error: any) {
    logger.error(error); // Log the detailed
    res.status(400).json({ message: error.message, error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      res.json({ token, userId: user.id });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const user: UserUpdateReq & {id: number} = req.body;
  user.id = parseInt(req.params.id, 10)

  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      delete user.password;
    }

    await Address.updateWithInfo(user.warehouseAddress);
    const response = await User.update(user, { where: { id: req.params.id } });
    res.json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = await User.findOne({
    where: { id: req.user.id },
    include: [
      { model: Address, as: 'warehouseAddress' },
    ],
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { name, id, email, role, warehouseAddress } = user;
  const filteredUser = { name, id, email, role, warehouseAddress };

  res.json(filteredUser);
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      include: [
        { model: Address, as: 'warehouseAddress' },
      ],
    }); // Fetch selected attributes
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

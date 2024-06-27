import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: User;
}

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, warehouseAddress } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role, warehouseAddress });
    res.status(201).json(user);
  } catch (error: any) {
    console.error(error); // Log the detailed error
    res.status(400).json({ message: error.message, errors: error.errors });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { name, email, password, role, warehouseAddress } = req.body;
  try {
    const updates: Partial<User> = { name, email, role, warehouseAddress };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    const [rows, user] = await User.update(updates, { where: { id: req.params.id }, returning: true });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(req.user);
};

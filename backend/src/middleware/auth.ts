import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

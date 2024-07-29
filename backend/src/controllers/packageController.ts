// backend/src/controllers/packageController.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { Op } from 'sequelize';
import logger from '../config/logger';

export const addPackage = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { fromAddress, toAddress, length, width, height, weight, reference } = req.body;
  const trackingNumber = generateTrackingNumber();

  try {
    const fromAddressId = (await Address.createWithInfo(fromAddress)).id;
    const toAddressId = (await Address.createWithInfo(toAddress)).id;

    const pkg = await Package.create({
      userId: req.user.id,
      fromAddressId,
      toAddressId,
      length,
      width,
      height,
      weight,
      trackingNumber,
      reference,
    });

    res.status(201).json(pkg);
  } catch (error: any) {
    logger.error(error); // Log the detailed error
    res.status(400).json({ message: error.message, errors: error.errors });
  }
};

export const getPackages = async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100; // Default limit to 20 if not provided
  const offset = parseInt(req.query.offset as string) || 0; // 
  const userId = req.user.id; 
  const search = req.query.search; // 
  try {
    const total = (await Package.count({ where: { userId } })) || 0;

    const whereCondition = search
    ? {
        userId,
        trackingNumber: {
          [Op.like]: `%${search}%`,
        },
      }
    : {userId};

    const packages = await Package.findAll({
      include: [
        { model: Address, as: 'fromAddress' },
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

export const updatePackage = async (req: Request, res: Response) => {
  const { fromAddress, toAddress, length, width, height, weight } = req.body;
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.updateWithInfo(fromAddress, pkg.fromAddressId );
    await Address.updateWithInfo(toAddress, pkg.toAddressId);

    await pkg.update({ length, width, height, weight });

    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.destroy({ where: { id: pkg.fromAddressId } });
    await Address.destroy({ where: { id: pkg.toAddressId } });
    await Package.destroy({ where: { id: req.params.id } });

    res.json({ message: 'Package deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackageDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findOne({
      where: { id },
      include: [
        { model: Address, as: 'fromAddress' },
        { model: Address, as: 'toAddress' },
        { model: User, as: 'user' },
      ],
    });

    if (!pkg) {
      throw new Error('Package not found');
    }

    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

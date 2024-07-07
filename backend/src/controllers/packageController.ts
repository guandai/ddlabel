// backend/src/controllers/packageController.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';

export const addPackage = async (req: Request, res: Response) => {
  const { userId, shipFromAddress, shipToAddress, length, width, height, weight } = req.body;
  const trackingNumber = generateTrackingNumber();

  try {
    const fromAddress = await Address.create(shipFromAddress);
    const toAddress = await Address.create(shipToAddress);

    const pkg = await Package.create({
      userId,
      shipFromAddressId: fromAddress.id,
      shipToAddressId: toAddress.id,
      length,
      width,
      height,
      weight,
      trackingNumber,
    });

    res.status(201).json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: Address, as: 'shipFromAddress' },
        { model: Address, as: 'shipToAddress' },
      ],
    });
    res.json(packages);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
    await Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });

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

    await Address.destroy({ where: { id: pkg.shipFromAddressId } });
    await Address.destroy({ where: { id: pkg.shipToAddressId } });
    await Package.destroy({ where: { id: req.params.id } });

    res.json({ message: 'Package deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editPackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;

  try {
    const pkg = await Package.findByPk(id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
    await Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });

    await pkg.update({ length, width, height, weight });

    res.json(pkg);
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
        { model: Address, as: 'shipFromAddress' },
        { model: Address, as: 'shipToAddress' },
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

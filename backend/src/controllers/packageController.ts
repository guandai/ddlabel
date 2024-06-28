import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';

export const addPackage = async (req: Request, res: Response) => {
  const { userId, shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
  const trackingNumber = generateTrackingNumber(); // Generate a tracking number

  try {
    const pkg = await Package.create({
      userId,
      shipToAddress,
      phone,
      length,
      width,
      height,
      weight,
      postCode,
      email,
      state,
      name,
      trackingNumber // Add the tracking number to the package
    });
    res.status(201).json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.findAll();
    res.json(packages);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
  try {
    const [rows, pkg] = await Package.update({ shipToAddress, phone, length, width, height, weight, postCode, email, state, name }, { where: { id: req.params.id }, returning: true });
    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    await Package.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Package deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editPackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;

  try {
    const [updated] = await Package.update({
      shipToAddress,
      phone,
      length,
      width,
      height,
      weight,
      postCode,
      email,
      state,
      name
    }, {
      where: { id }
    });

    if (updated) {
      const updatedPackage = await Package.findOne({ where: { id } });
      res.status(200).json(updatedPackage);
    } else {
      throw new Error('Package not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackageDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findOne({ where: { id } });
    if (pkg) {
      res.status(200).json(pkg);
    } else {
      throw new Error('Package not found');
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

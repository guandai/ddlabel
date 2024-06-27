// backend/src/controllers/packageController.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';

export const addPackage = async (req: Request, res: Response) => {
  const { userId, shipToAddress, phone, length, width, height, weight, postCode, email, state, name } = req.body;
  try {
    const pkg = await Package.create({ userId, shipToAddress, phone, length, width, height, weight, postCode, email, state, name });
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

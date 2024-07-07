// backend/src/controllers/postalZoneController.ts
import { Request, Response } from 'express';
import { PostalZone } from '../models/PostalZone';

export const getPostalZones = async (req: Request, res: Response) => {
  try {
    const postalZones = await PostalZone.findAll();
    res.json(postalZones);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPostalZoneById = async (req: Request, res: Response) => {
  try {
    const postalZone = await PostalZone.findByPk(req.params.id);
    if (postalZone) {
      res.json(postalZone);
    } else {
      res.status(404).json({ message: 'Postal Zone not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

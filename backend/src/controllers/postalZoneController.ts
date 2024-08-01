// backend/src/controllers/postalZoneController.ts
import { Request, Response } from 'express';
import { PostalZone, PostalZoneAttributes } from '../models/PostalZone';
import { KeyZones } from '@ddlabel/shared';

export const getPostalZones = async (req: Request, res: Response) => {
  try {
    const postalZones = await PostalZone.findAll();
    res.json(postalZones);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPostalZoneByZip = async (req: Request, res: Response) => {
  try {
    const { zip_code } = req.query as { zip_code: string };
    const postalZone = await PostalZone.findOne({
      where: { zip_code },
    });
    if (postalZone) {
      res.json(postalZone);
    } else {
      res.status(404).json({ message: 'PostalZone not found' });
    }
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
      res.status(404).json({ message: 'PostalZone not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProposalByZip = async (req: Request, res: Response) => {
  const { zip_code } = req.query as { zip_code: string };
  try {
    const postalZone = await PostalZone.findOne({
      where: { zip_code }, // Cast zip to string
    });

    if (postalZone) {
      res.json(postalZone.proposal);
    } else {
      res.status(404).json({ message: 'Proposal not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getZoneByProposalAndZip = async (req: Request, res: Response) => {
  const { proposal, zip_code } = req.query as { zip_code: string; proposal: KeyZones };

  try {
    const postalZone: PostalZone | null = await PostalZone.findOne({
      where: {
          zip_code,
       },
    });

    if (postalZone) {
      res.json(postalZone[proposal]);
    } else {
      res.status(404).json({ message: 'Zone not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

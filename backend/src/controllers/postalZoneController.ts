// backend/src/controllers/postalZoneController.ts
import { Request } from 'express';
import { PostalZone } from '../models/PostalZone';
import { GetPostalZoneReq, GetPostalZoneRes, GetZoneRes, GetZoneReq, ResponseAdv, KeyZones } from '@ddlabel/shared';

export const getPostalZone = async (req: Request, res: ResponseAdv<GetPostalZoneRes>) => {
  try {
    const { zip } = req.query;
    if (!zip || typeof zip !== 'string') {
      return res.status(400).json({ message: '!Zip code is required' });
    }
    const postalZone = await PostalZone.findOne({
      where: { zip },
    });
    if (postalZone) {
      return res.json({ postalZone });
    } else {
      return res.status(404).json({ message: 'PostalZone not found' });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getZone = async (req: Request<GetZoneReq>, res: ResponseAdv<GetZoneRes>) => {
  const { proposal, zip } = req.query;
  if (typeof proposal !== 'string' || typeof zip !=='string') {
    return res.status(400).json({ message: 'String Proposal and zip code are required' });
  }

  try {
    const postalZone: PostalZone | null = await PostalZone.findOne({
      where: { zip }
    });

    const zone = postalZone?.[proposal as KeyZones];
    if (!zone) {
      return res.status(404).json({ message: 'No Avaliable Zone' });
    }

    return res.json({ zone });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// backend/src/controllers/postalZoneController.ts
import { Request } from 'express';
import { PostalZone } from '../models/PostalZone';
import { GetPostalZoneReq, GetPostalZoneRes, GetZoneRes, GetZoneReq, ResponseAdv } from '@ddlabel/shared';
import { Return400 } from '../utils/errors';

export const getPostalZone = async (req: Request<GetPostalZoneReq>, res: ResponseAdv<GetPostalZoneRes>) => {
  try {
    const { zip } = req.query;
    if (!zip || typeof zip !== 'string') {
      return Return400(res, '!Zip code is required' );
    }
    const postalZone = await PostalZone.findOne({
      where: { zip },
    });
    if (postalZone) {
      return res.json({ postalZone });
    } else {
      return res.status(404).json({ message: `PostalZone not found by zip ${zip}` });
    }
  } catch (error: any) {
    return Return400(res, error.message );
  }
};

export const getZone = async (req: Request<GetZoneReq>, res: ResponseAdv<GetZoneRes>) => {
  const { fromZip, toZip } = req.query;
  if (typeof fromZip !== 'string' || typeof toZip !=='string') {
    return Return400(res, 'fromZip and toZip code should be string' );
  }

  try {
    const fromPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: fromZip } });
    const toPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: toZip }});

    if (!fromPostalZone) {
      return Return400(res, `Can Not find From PostalZone by zip ${fromZip}`);
    }
    if (!toPostalZone) {
      return Return400(res, `Can Not find To PostalZone by zip ${toZip}` );
    }

    const zone = toPostalZone?.[fromPostalZone.proposal];
    if (!zone || zone === '-') {
      return Return400(res, `No Avaliable Zone from ${fromPostalZone.proposal} to ${toPostalZone.proposal}` );
    }

    return res.json({ zone });
  } catch (error: any) {
    return Return400(res, error.message );
  }
};

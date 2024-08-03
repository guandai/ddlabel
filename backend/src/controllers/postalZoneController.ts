// backend/src/controllers/postalZoneController.ts
import { Request } from 'express';
import { PostalZone } from '../models/PostalZone';
import { GetPostalZoneReq, GetPostalZoneRes, GetZoneRes, GetZoneReq, ResponseAdv } from '@ddlabel/shared';
import { ReturnMsg } from '../utils/errors';

export const getPostalZone = async (req: Request<GetPostalZoneReq>, res: ResponseAdv<GetPostalZoneRes>) => {
  try {
    const { zip } = req.query;
    if (!zip || typeof zip !== 'string') {
      return ReturnMsg(res, '!Zip code is required' );
    }
    const postalZone = await PostalZone.findOne({
      where: { zip },
    });
    if (postalZone) {
      return res.json({ postalZone });
    } else {
      return ReturnMsg(res,`PostalZone not found by zip ${zip}`, 422);
    }
  } catch (error: any) {
    return ReturnMsg(res, `getPostalZone Err: ${error.message}`);
  }
};

export const getZone = async (req: Request<GetZoneReq>, res: ResponseAdv<GetZoneRes>) => {
  const { fromZip, toZip } = req.query;
  if (typeof fromZip !== 'string' || typeof toZip !=='string') {
    return ReturnMsg(res, 'fromZip and toZip code should be string' );
  }

  try {
    const fromPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: fromZip } });
    const toPostalZone: PostalZone | null = await PostalZone.findOne({ where: { zip: toZip }});

    if (!fromPostalZone) {
      return ReturnMsg(res, `Can Not find From PostalZone by zip ${fromZip}`, 422);
    }
    if (!toPostalZone) {
      return ReturnMsg(res, `Can Not find To PostalZone by zip ${toZip}`, 422);
    }

    const zone = toPostalZone?.[fromPostalZone.proposal];
    if (!zone || zone === '-') {
      return ReturnMsg(res, `No Avaliable Zone from ${fromPostalZone.proposal} to ${toPostalZone.proposal}`, 422);
    }

    return res.json({ zone });
  } catch (error: any) {
    return ReturnMsg(res, error.message );
  }
};

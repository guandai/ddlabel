import { Request } from 'express';
import { ZipCode } from '../models/ZipCode';
import getZipInfo from '../utils/getZipInfo';
import { ResponseAdv, ZipInfo } from '@ddlabel/shared';

export const getZipCode = async (req: Request, res: ResponseAdv<ZipCode>) => {
  try {
    const { zip } = req.params;
    const zipCode = await ZipCode.findOne({ where: { zip } });
    if (!zipCode) {
      return res.status(404).json({ message: 'Zip code not found' });
    }
    return res.json(zipCode);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getZipCodeFromFile = async (req: Request, res: ResponseAdv<ZipInfo>) => {
  const info = await getZipInfo(req.params.zip);
  if (!info) {
    return res.status(404).json({ message: 'Zip code not found' });
  }
  return res.json({ zip: req.params.zip, city: info.city, state: info.state });
}

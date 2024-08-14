import { ZipCode } from '../models/ZipCode';
import getZipInfo from '../utils/getInfo';
import { ResponseAdv, ZipInfo } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { NotFoundError, resHeaderError } from '../utils/errors';

export const getZipCode = async (req: AuthRequest, res: ResponseAdv<ZipCode>) => {
  const { zip } = req.params;
  try {
    const zipCode = await ZipCode.findOne({ where: { zip } });
    if (!zipCode) {
      throw new NotFoundError(`Zip code not found - ${zip}`);
    }
    return res.json(zipCode);
  } catch (error: any) {
    return resHeaderError('getZipCode', error, req.params, res);
  }
};

export const getZipCodeFromFile = async (req: AuthRequest, res: ResponseAdv<ZipInfo>) => {
  const info = getZipInfo(req.params.zip);
  if (!info) {
    return res.status(404).json({ message: 'Zip code not found' });
  }
  return res.json({ zip: req.params.zip, city: info.city, state: info.state });
}

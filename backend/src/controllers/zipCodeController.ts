import { Request } from 'express';
import { ZipCode } from '../models/ZipCode';
import getZipInfo from '../utils/getZipInfo';
import { GetZipCodesRes, ResponseAdv, ZipInfo } from '@ddlabel/shared';

export const getZipCode = async (req: Request, res: ResponseAdv<ZipCode>) => {
  try {
    const { zip } = req.params;
    const zipCode = await ZipCode.findOne({ where: { zip } });
    if (!zipCode) {
      return res.status(404).json({ message: 'Zip code not found' });
    }
    res.json(zipCode);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getZipCodes = async (req: Request, res: ResponseAdv<GetZipCodesRes>) => {
  try {
    // Get the page and pageSize from the query parameters, with default values
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Query the database with limit and offset for pagination
    const data = await ZipCode.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / pageSize);

    // Return the paginated data, total items, and total pages
    const result: GetZipCodesRes = {
      page: page,
      pageSize: pageSize,
      totalItems: data.count,
      totalPages: totalPages,
      data: data.rows,
    };
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getZipCodeFromFile = async (req: Request, res: ResponseAdv<ZipInfo>) => {
  const info = getZipInfo(req.params.zip);
  if (!info) {
    res.status(404).json({ message: 'Zip code not found' });
    return;
  }
  const result: ZipInfo = { zip: req.params.zip, city: info.city, state: info.state };
  res.json(result);
}

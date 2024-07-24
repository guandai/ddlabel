import { Request, Response } from 'express';
import { ZipCodeData } from '../models/ZipCodeData';
import getZipInfo from '../utils/getZipInfo';

export const getZipCodeData = async (req: Request, res: Response) => {
  try {
    const { zip } = req.params;
    const data = await ZipCodeData.findOne({ where: { zip } });
    if (!data) {
      return res.status(404).json({ message: 'Zip code not found' });
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllZipCodeData = async (req: Request, res: Response) => {
  try {
    // Get the page and pageSize from the query parameters, with default values
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    // Calculate the offset
    const offset = (page - 1) * pageSize;

    // Query the database with limit and offset for pagination
    const data = await ZipCodeData.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / pageSize);

    // Return the paginated data, total items, and total pages
    res.json({
      page: page,
      pageSize: pageSize,
      totalItems: data.count,
      totalPages: totalPages,
      data: data.rows,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getZipCodeDataFromFile = async (req: Request, res: Response) => {
	const info = getZipInfo(req.params.zip);
  if (!info) {
    return res.status(404).json({ message: 'Zip code not found' });
  }
  res.json({
    zip: req.params.zip,
    city: info.city,
    state: info.state,
  });
}

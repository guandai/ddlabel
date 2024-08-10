import { Response } from 'express';
import { SortCode } from '../models/SortCode';
import { AuthRequest } from '../types';

exports.getAllSortCodes = async (req: AuthRequest, res: Response) => {
  try {
    const sortCodes = await SortCode.findAll();
    return res.json(sortCodes);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

exports.createSortCode = async (req: AuthRequest, res: Response) => {
  try {
    const newSortCode = await SortCode.create(req.body);
    return res.status(201).json(newSortCode);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updateSortCode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await SortCode.update(req.body, { where: { id: id } });

    if (updated) {
      const updatedSortCode = await SortCode.findByPk(id);
      return res.json(updatedSortCode);
    } else {
      return res.status(404).json({ message: 'Sort code not found' });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteSortCode = async (req: AuthRequest, res: Response) => {
  try {
    if (await SortCode.destroy({ where: { id: req.params } })) {
      return res.status(200).send({success: true});
    } else {
      return res.status(422).json({ message: 'Sort code not found' });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

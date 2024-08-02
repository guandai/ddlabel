// backend/src/controllers/addressController.ts
import { Request } from 'express';
import { Address } from '../models/Address';
import { ResponseAdv } from '@ddlabel/shared';

// Create a new address
export const createAddress = async (req: Request, res: ResponseAdv<Address>) => {
  try {
    res.status(201).json(await Address.createWithInfo(req.body));
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all addresses
export const getAddresses = async (req: Request, res: ResponseAdv<Address[]>) => {
  try {
    res.json(await Address.findAll()); 
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single address by ID
export const getAddressById = async (req: Request, res: ResponseAdv<Address>) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(address);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update an address
export const updateAddress = async (req: Request, res: ResponseAdv<Address>) => {
  const { name, address1, address2, city, state, zip, phone } = req.body;

  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.update(req.body);
    res.json(address);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

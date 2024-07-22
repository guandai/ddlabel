// backend/src/controllers/addressController.ts
import { Request, Response } from 'express';
import { Address } from '../models/Address';
import { getCityState } from '../utils/getZipInfo';

// Create a new address
export const createAddress = async (req: Request, res: Response) => {
  const { name, addressLine1, addressLine2, zip, phone, city, state } = req.body;

  try {
    const address = await Address.createWithInfo({
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      phone,
    });
    res.status(201).json(address);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.findAll();
    res.json(addresses);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single address by ID
export const getAddressById = async (req: Request, res: Response) => {
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
export const updateAddress = async (req: Request, res: Response) => {
  const { name, addressLine1, addressLine2, city, state, zip, country, phone } = req.body;

  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    address.name = name;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.zip = zip;
    address.phone = phone;

    await address.save();
    res.json(address);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await Address.findByPk(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.destroy();
    res.json({ message: 'Address deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

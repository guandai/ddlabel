// backend/src/controllers/packageController.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';
import { User } from '../models/User';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export const addPackage = async (req: Request, res: Response) => {
  const { user, shipFromAddress, shipToAddress, length, width, height, weight, reference } = req.body;
  const trackingNumber = generateTrackingNumber();

  try {
    const fromAddress = await Address.create(shipFromAddress);
    const toAddress = await Address.create(shipToAddress);

    const pkg = await Package.create({
      userId: user.id,
      shipFromAddressId: fromAddress.id,
      shipToAddressId: toAddress.id,
      length,
      width,
      height,
      weight,
      trackingNumber,
      reference,
    });

    res.status(201).json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: Address, as: 'shipFromAddress' },
        { model: Address, as: 'shipToAddress' },
        { model: User, as: 'user' },
      ],
    });
    res.json(packages);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
    await Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });

    await pkg.update({ length, width, height, weight });

    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByPk(req.params.id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.destroy({ where: { id: pkg.shipFromAddressId } });
    await Address.destroy({ where: { id: pkg.shipToAddressId } });
    await Package.destroy({ where: { id: req.params.id } });

    res.json({ message: 'Package deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const editPackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { shipFromAddress, shipToAddress, length, width, height, weight } = req.body;

  try {
    const pkg = await Package.findByPk(id);

    if (!pkg) {
      throw new Error('Package not found');
    }

    await Address.update(shipFromAddress, { where: { id: pkg.shipFromAddressId } });
    await Address.update(shipToAddress, { where: { id: pkg.shipToAddressId } });

    await pkg.update({ length, width, height, weight });

    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPackageDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pkg = await Package.findOne({
      where: { id },
      include: [
        { model: Address, as: 'shipFromAddress' },
        { model: Address, as: 'shipToAddress' },
        { model: User, as: 'user' },
      ],
    });

    if (!pkg) {
      throw new Error('Package not found');
    }

    res.json(pkg);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const importPackages = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }  
    const file = req.file;
    const { packageUserId } = req.body;
    const results: any[] = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const pkgData of results) {
          console.log(`pkgData`, pkgData);
          const {
            length, 
            width, 
            height, 
            weight, 
            reference,
            shipFromName,
            shipFromAddressStreet, 
            shipFromAddressCity,
            shipFromAddressState, 
            shipFromAddressZip, 
            shipToName,
            shipToAddressStreet, 
            shipToAddressCity, 
            shipToAddressState, 
            shipToAddressZip } = pkgData;
          const trackingNumber = generateTrackingNumber();

          const shipFromAddress = {
            name: shipFromName,
            addressLine1: shipFromAddressStreet,
            city: shipFromAddressCity,
            state: shipFromAddressState,
            zip: shipFromAddressZip,
          };
    
          const shipToAddress = {
            name: shipToName,
            addressLine1: shipToAddressStreet,
            city: shipToAddressCity,
            state: shipToAddressState,
            zip: shipToAddressZip,
          };

          try {

            const fromAddress = await Address.create(shipFromAddress);
            const toAddress = await Address.create(shipToAddress);
          
            await Package.create({
              userId: packageUserId,
              shipFromAddressId: fromAddress.id,
              shipToAddressId: toAddress.id,
              length,
              width,
              height,
              weight,
              trackingNumber,
              reference,
            });
          } catch (error: any) {
            return res.status(500).send({ error: error.message });
          }
        }
        res.status(200).send({ message: 'Packages imported successfully' });
      })
  
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

export const uploadMiddleware = upload.single('packageCsvFile');  // the same as PackageTable.tsx

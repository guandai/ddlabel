import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { GetPackagesCsvRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest } from '../types';
import { Address } from '../models/Address';
import { Package } from '../models/Package';
import { getRelationQuery } from './packageControllerUtil';
import { Transaction } from '../models/Transaction';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'json2csv'; // Import parse from json2csv

export const getCsvPackages = async (req: AuthRequest, res: ResponseAdv<GetPackagesCsvRes>) => {
  const relationQuery = getRelationQuery(req);

  try {
    const packages = await Package.findAll({
      ...relationQuery,
      attributes: { exclude: ['userId'] }, // Exclude user column
      include: [
        {
          model: Address,
          as: 'fromAddress',
          attributes: ['address1', 'address2', 'city', 'state', 'zip'],
        },
        {
          model: Address,
          as: 'toAddress',
          attributes: ['address1', 'address2', 'city', 'state', 'zip'],
        },
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['transactionId', 'amount', 'currency', 'status'],
        },
      ],
    });

    // Convert the data to JSON
    const packagesData = packages.map(pkg => pkg.toJSON());

    // Specify fields for the CSV
    const fields = [
      'id', 'trackingNo', 'createdAt', 'updatedAt', // Package fields
      'fromAddress.address1', 'fromAddress.address2', 'fromAddress.city', 'fromAddress.state', 'fromAddress.zip', // From address fields
      'toAddress.address1', 'toAddress.address2', 'toAddress.city', 'toAddress.state', 'toAddress.zip', // To address fields
      'transaction.transactionId', 'transaction.amount', 'transaction.currency', 'transaction.status' // Transaction fields
    ];

    // Convert JSON to CSV
    const csv = parse(packagesData, { fields });

    // Define a file path for storing the CSV
    const filePath = path.join(__dirname, '../tmp', `packages_${uuidv4()}.csv`);

    // Write the CSV to a file
    fs.writeFileSync(filePath, csv);

    // Return the download URL
    const downloadUrl = `${req.protocol}://${req.get('host')}/download/${path.basename(filePath)}`;
    return res.json({ url: downloadUrl, total: packages.length });

  } catch (error: any) {
    logger.error(`Error in getPackages: ${error}`);
    return res.status(400).json({ message: error.message });
  }
};

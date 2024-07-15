// backend/src/controllers/packageUpload.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const DEFAULT_BATCH_SIZE = 500; // Start with a moderate batch size
const MAX_BATCH_SIZE = 1000; // Maximum batch size for tuning
const MIN_BATCH_SIZE = 100; // Minimum batch size for tuning

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
            let packageBatch: any[] = [];
            let fromAddressBatch: any[] = [];
            let toAddressBatch: any[] = [];
            let batchSize = DEFAULT_BATCH_SIZE;

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
                    shipToAddressZip
                } = pkgData;
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

                fromAddressBatch.push(shipFromAddress);
                toAddressBatch.push(shipToAddress);
                packageBatch.push({
                    userId: packageUserId,
                    shipFromAddress,
                    shipToAddress,
                    length,
                    width,
                    height,
                    weight,
                    trackingNumber,
                    reference,
                });

                if (packageBatch.length >= batchSize) {
                    await processBatch(packageBatch, fromAddressBatch, toAddressBatch);
                    packageBatch = [];
                    fromAddressBatch = [];
                    toAddressBatch = [];

                    // Adjust batch size based on monitoring feedback (pseudo-code)
                    // Example: batchSize = adjustBatchSize(batchSize, monitoringFeedback);
                }
            }

            // Process any remaining data
            if (packageBatch.length > 0) {
                await processBatch(packageBatch, fromAddressBatch, toAddressBatch);
            }

            res.status(200).send({ message: 'Packages imported successfully' });
        });
};

const processBatch = async (packageBatch: any[], fromAddressBatch: any[], toAddressBatch: any[]) => {
    try {
        const fromAddresses = await Address.bulkCreate(fromAddressBatch);
        const toAddresses = await Address.bulkCreate(toAddressBatch);

        const packages = packageBatch.map((pkg, index) => ({
            ...pkg,
            shipFromAddressId: fromAddresses[index].id,
            shipToAddressId: toAddresses[index].id
        }));

        await Package.bulkCreate(packages);
    } catch (error: any) {
        console.error('Error processing batch', error);
        throw new Error('Batch processing failed');
    }
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

export const uploadMiddleware = upload.single('packageCsvFile');

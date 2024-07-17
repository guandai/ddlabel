// backend/src/controllers/packageUpload.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

const BATCH_SIZE = 500;

export const importPackages = async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).send({ message: 'No file uploaded' });
	}
	const file = req.file;
	const { packageUserId, headerMapping } = req.body;
	type Mapping = { [key: string]: string };
	const mapping: Mapping = JSON.parse(headerMapping);

	const results: any[] = [];
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';

	fs.createReadStream(file.path)
		.pipe(csv())
		.on('data', (data) => {
			
			type CsvData = { [key: string]: string | number | undefined};

			const fields = [
				'length', 'width', 'height', 'weight', 'reference',
				'shipFromName', 'shipFromAddressStreet', 'shipFromAddressCity', 'shipFromAddressState', 'shipFromAddressZip',
				'shipToName', 'shipToAddressStreet', 'shipToAddressCity', 'shipToAddressState', 'shipToAddressZip'
			];

			const mappedData = fields.reduce((acc: CsvData, field: string) => {
				acc[field] = data[mapping[field]];
				return acc;
			}, {});
			results.push(mappedData);
			return results;
		})
		.on('end', async () => {
			let packageBatch: any[] = [];
			let fromAddressBatch: any[] = [];
			let toAddressBatch: any[] = [];
			let processedCount = 0;

			for (const pkgData of results) {
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

				if (packageBatch.length >= BATCH_SIZE) {

						await processBatch(packageBatch, fromAddressBatch, toAddressBatch);
						packageBatch = [];
						fromAddressBatch = [];
						toAddressBatch = [];

						processedCount += BATCH_SIZE;
						io.to(socketId).emit('progress', {
							processed: processedCount,
							total: results.length
						});
					
				}
			}

			// Process any remaining data
			if (packageBatch.length > 0) {
				try {
					await processBatch(packageBatch, fromAddressBatch, toAddressBatch);
					processedCount += packageBatch.length;
					io.to(socketId).emit('progress', {
						processed: processedCount,
						total: results.length
					});
				} catch (error) {
					console.error('Error processing batch', error);
					return res.status(500).send({ message: 'Error processing batch' });
				}
			}

			res.status(200).send({ message: 'Packages imported successfully' });
		})
		.on('error', (err) => {
			console.error('Error parsing CSV:', err);
			res.status(500).send({ message: 'Error importing packages' });
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

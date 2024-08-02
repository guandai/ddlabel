// backend/src/controllers/packageUpload.ts
import { Request } from 'express';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { reportIoSocket } from '../utils/reportIo';
import { AuthRequest } from '../types';
import logger from '../config/logger';
import { AddressEnum, ImportPackageRes, PackageSource, ResponseAdv } from '@ddlabel/shared';
import { BatchDataType, CsvData, getPreparedData, processBatch } from './packageBatchFuntions';

type OnDataParams = {
	req: AuthRequest,
	csvData: CsvData,
	pkgAll: BatchDataType,
}

const BATCH_SIZE = 500;

const onData = (OnDataParams: OnDataParams) => {
	const { req, csvData, pkgAll } = OnDataParams;
	const { packageCsvLength, packageCsvMap } = req.body;

	const prepared = getPreparedData(packageCsvMap, csvData);
	if (!prepared) return;

	const { mappedData, fromZipInfo, toZipInfo } = prepared;
	pkgAll.pkgBatch.push({
		userId: req.user.id,
		length: mappedData['length'] || 0,
		width: mappedData['width'] || 0,
		height: mappedData['height'] || 0,
		weight: mappedData['weight'] || 0,
		trackingNo: mappedData['trackingNo'] || generateTrackingNo(),
		referenceNo: mappedData['referenceNo'],
		source: PackageSource.api,
	});
	pkgAll.shipFromBatch.push({
		...fromZipInfo,
		name: mappedData['fromName'],
		address1: mappedData['fromAddress1'],
		address2: mappedData['fromAddress2'],
		zip: mappedData['fromAddressZip'],
		addressType: AddressEnum.fromPackage,
	});
	pkgAll.shipToBatch.push({
		...toZipInfo,
		name: mappedData['toName'],
		address1: mappedData['toAddress1'],
		address2: mappedData['toAddress2'],
		zip: mappedData['toAddressZip'],
		addressType: AddressEnum.toPackage,
	})
	reportIoSocket('generate', req, pkgAll.pkgBatch.length, packageCsvLength);
	return;
};

const onEndData = async (req: Request, res: ResponseAdv<ImportPackageRes>, pkgAll: BatchDataType) => {
	const { pkgBatch, shipFromBatch, shipToBatch } = pkgAll;
	let processed = 0;
	const batchData: BatchDataType = {
		pkgBatch: [],
		shipFromBatch: [],
		shipToBatch: [],
	}

	const turns = Math.ceil(pkgBatch.length / BATCH_SIZE);

	for (let i = 0; i < turns; i++) {
		const start = i * BATCH_SIZE;
		const pkgDataSlice = pkgBatch.slice(start, start + BATCH_SIZE);
		const fromSlice = shipFromBatch.slice(start, start + BATCH_SIZE);
		const toSlice = shipToBatch.slice(start, start + BATCH_SIZE);

		batchData.shipFromBatch = fromSlice;
		batchData.shipToBatch = toSlice;
		batchData.pkgBatch = pkgDataSlice;

		try {
			await processBatch(batchData);
			batchData.pkgBatch = [];
			batchData.shipFromBatch = [];
			batchData.shipToBatch = [];
			processed += pkgDataSlice.length;
			reportIoSocket('insert', req, processed, pkgBatch.length);
		} catch (error: any) {
			logger.error('Error processing batch', error);
			res.status(400).send({ message: `OnEnd Error processing batch: ${error?.errors?.[0]?.message}` });
		}
	}

	res.status(200).send({ message: 'OnEnd PkgBatch imported successfully' });
};


export const importPackages = async (req: Request, res: ResponseAdv<ImportPackageRes>) => {
	const { body, file } = req;

	if (!file) {
		const result = res.status(400).send({ message: 'No file uploaded' });
		return result
	}

	const pkgAll: BatchDataType = {
		pkgBatch: [],
		shipFromBatch: [],
		shipToBatch: [],
	}

	fs.createReadStream(file.path)
		.pipe(csv())
		.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
		.on('end', async () => onEndData(req, res, pkgAll))
		.on('error', (err) => {
			logger.error('Error parsing CSV:', err);
			return res.status(400).send({ message: 'On Error importing pkgBatch' });
		});
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

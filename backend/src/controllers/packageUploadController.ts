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
import { aggregateError } from '../utils/errors';

type OnDataParams = {
	req: AuthRequest,
	csvData: CsvData,
	pkgAll: BatchDataType,
}

type OnEndParams = {
	stream: fs.ReadStream,
	req: AuthRequest,
	pkgAll: BatchDataType,
}

const BATCH_SIZE = 500;

const onData = ({ req, csvData, pkgAll }: OnDataParams) => {
	const { packageCsvLength, packageCsvMap } = req.body;
	const prepared = getPreparedData(packageCsvMap, csvData);
	const userId = req.user.id;
	if (!prepared) return;

	const { mappedData, fromZipInfo, toZipInfo } = prepared;
	pkgAll.pkgBatch.push({
		userId,
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
		userId,
		address1: mappedData['fromAddress1'],
		address2: mappedData['fromAddress2'],
		zip: mappedData['fromAddressZip'],
		addressType: AddressEnum.fromPackage,
	});
	pkgAll.shipToBatch.push({
		...toZipInfo,
		name: mappedData['toName'],
		userId,
		address1: mappedData['toAddress1'],
		address2: mappedData['toAddress2'],
		zip: mappedData['toAddressZip'],
		addressType: AddressEnum.toPackage,
	})
	reportIoSocket('generate', req, pkgAll.pkgBatch.length, packageCsvLength);
	return;
};

const onEnd = async ({ stream, req, pkgAll }: OnEndParams) => {
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
			stream.emit('success');
		} catch (error: any) {
			logger.error(`Error in onEnd: ${error}`); // Log the detailed
			stream.emit('error', aggregateError(error));
		}
	}
};

export const importPackages = async (req: Request, res: ResponseAdv<ImportPackageRes>) => {
	const { file } = req;
	if (!file) {
		return res.status(400).send({ message: 'No file uploaded' });
	}

	const pkgAll: BatchDataType = {
		pkgBatch: [],
		shipFromBatch: [],
		shipToBatch: [],
	}

	const stream = fs.createReadStream(file.path);
	stream.pipe(csv())
		.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
		.on('end', async () => onEnd({ stream, req, pkgAll }));

	//  if .on('error')  follow the chain, the error can not be catched by stream
	stream.on('error', error => {
		logger.error(`Error in importPackages: ${error}`);
		return res.status(400).send({ message: `Importing Error: ${error}` })
	});
	stream.on('success', () => {
		return res.json({ message: `Importing Done!` });
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

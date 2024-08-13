// backend/src/controllers/packageUpload.ts
import { generateTrackingNo } from '../utils/generateTrackingNo';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { reportIoSocket } from '../utils/reportIo';
import logger from '../config/logger';
import { AddressEnum, ImportPackageRes, PackageSource, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest } from '../types';
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

const onData = async ({ req, csvData, pkgAll }: OnDataParams) => {
	const { packageCsvLength, packageCsvMap } = req.body;
	const prepared = await getPreparedData(packageCsvMap, csvData);
	const userId = req.user.id;
	if (!prepared) return;

	const { mappedData, fromZipInfo, toZipInfo, logError } = prepared;
	pkgAll.errorArr.push(logError);
	pkgAll.pkgArr.push({
		userId,
		length: mappedData['length'] || 0,
		width: mappedData['width'] || 0,
		height: mappedData['height'] || 0,
		weight: mappedData['weight'] || 0,
		trackingNo: mappedData['trackingNo'] || generateTrackingNo(),
		referenceNo: mappedData['referenceNo'] || '',
		source: PackageSource.api,
	});
	pkgAll.shipFromArr.push({
		...fromZipInfo,
		name: mappedData['fromAddressName'],
		userId,
		address1: mappedData['fromAddress1'],
		address2: mappedData['fromAddress2'],
		addressType: AddressEnum.fromPackage,
	});
	pkgAll.shipToArr.push({
		...toZipInfo,
		name: mappedData['toAddressName'],
		userId,
		address1: mappedData['toAddress1'],
		address2: mappedData['toAddress2'],
		addressType: AddressEnum.toPackage,
	})
	reportIoSocket('generate', req, pkgAll.pkgArr.length, packageCsvLength);
	return;
};

const onEnd = async ({ stream, req, pkgAll }: OnEndParams) => {
	const { pkgArr, shipFromArr, shipToArr } = pkgAll;
	let processed = 0;
	const totalBatches = Math.ceil(pkgArr.length / BATCH_SIZE);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * BATCH_SIZE;
		const end = start + BATCH_SIZE;
		const batchData: BatchDataType = {
			errorArr: [],
			pkgArr: pkgArr.slice(start, end),
			shipFromArr: shipFromArr.slice(start, end),
			shipToArr: shipToArr.slice(start, end),
		};

		try {
			await processBatch(batchData);
			processed += BATCH_SIZE;
			reportIoSocket('insert', req, processed, pkgArr.length);
			stream.emit('success');
		} catch (error: any) {
			logger.error(`Error in onEnd: ${error}`); // Log the detailed
			stream.emit('error', aggregateError(error));
		}
	}
};

export const importPackages = async (req: AuthRequest, res: ResponseAdv<ImportPackageRes>) => {
	const { file } = req;
	if (!file) {
		return res.status(400).send({ message: 'No file uploaded' });
	}

	const pkgAll: BatchDataType = {
		errorArr: [],
		pkgArr: [],
		shipFromArr: [],
		shipToArr: [],
	}

	const stream = fs.createReadStream(file.path);
	stream.pipe(csv())
		.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
		.on('end', async () => onEnd({ stream, req, pkgAll }));

	stream.on('error', error => {
		logger.error(`Error in importPackages: ${error}`);
		deleteUploadedFile(file);
		return res.status(400).send({ message: `Importing Error: ${error}` })
	});
	stream.on('success', () => {
		deleteUploadedFile(file);
		return res.json({ message: `Importing Done!` });
	});
};

const deleteUploadedFile = (file: Express.Multer.File ) => {
	fs.unlink(file.path, (unlinkError) => {
		if (unlinkError) {
			logger.error(`Failed to delete file after process: ${unlinkError}`);
		}
	});
}
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

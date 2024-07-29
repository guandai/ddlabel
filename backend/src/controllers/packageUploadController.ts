// backend/src/controllers/packageUpload.ts
import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import { generateTrackingNumber } from '../utils/generateTrackingNumber';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import getZipInfo from '../utils/getZipInfo';
import { reportIoSocket } from '../utils/reportIo';
import { isValidJSON } from '../utils/errors';
import { AuthRequest } from '../types';
import logger from '../config/logger';
import { BaseData, FIELDS, HeaderMapping, KeyOfBaseData } from '@ddlabel/shared';

type BatchDataType = {
	pkgBatch: PackageRoot[],
	fromBatch: AddressData[],
	toBatch: AddressData[],
}

type PackageRoot = {
	userId: number,
	length: number,
	width: number,
	height: number,
	weight: number,
	tracking: string,
	reference: string,
}

type AddressData = {
	name: string,
	address1: string,
	address2: string,
	city: string,
	state: string,
	zip: string,
}

type CsvData = { [k: string]: string | number };

const BATCH_SIZE = 500;

const defaultMapping = FIELDS.reduce((acc: HeaderMapping, field: KeyOfBaseData) => {
	Object.assign(acc, { [field]: field });
	return acc;
}, {} as HeaderMapping);


const getMappingData = (data: CsvData, mapping: HeaderMapping) => {
	return FIELDS.reduce((acc: BaseData, field: KeyOfBaseData) => {
		const csvHeader = mapping[field];
		return Object.assign(acc, { [field]: !!csvHeader ? data[csvHeader] : null });
	}, {} as BaseData);
}

const onEndData = async (req: Request, res: Response, pkgAll: BatchDataType) => {
	const { pkgBatch, fromBatch, toBatch } = pkgAll;
	let processed = 0;
	const batchData: BatchDataType = {
		pkgBatch: [],
		fromBatch: [],
		toBatch: [],
	}

	const turns = Math.ceil(pkgBatch.length / BATCH_SIZE);

	for (let i = 0; i < turns; i++) {
		const start = i * BATCH_SIZE;
		const pkgDataSlice = pkgBatch.slice(start, start + BATCH_SIZE);
		const fromSlice = fromBatch.slice(start, start + BATCH_SIZE);
		const toSlice = toBatch.slice(start, start + BATCH_SIZE);

		batchData.fromBatch = fromSlice;
		batchData.toBatch = toSlice;
		batchData.pkgBatch = pkgDataSlice;

		try {
			await processBatch(batchData);
			batchData.pkgBatch = [];
			batchData.fromBatch = [];
			batchData.toBatch = [];
			processed += pkgDataSlice.length;
			reportIoSocket( 'insert', req, processed, pkgBatch.length );
		} catch (error) {
			logger.error('Error processing batch', error);
			return res.status(500).send({ message: 'Error processing batch' });
		}
	}

	res.status(200).send({ message: 'PkgBatch imported successfully' });
};

const getPreparedData = (packageCsvMap: string, data: CsvData) => {
	const mapping: HeaderMapping = isValidJSON(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
	const mappedData = getMappingData(data, mapping);
	const fromZipInfo = getZipInfo(mappedData['fromAddressZip'] );
	const toZipInfo = getZipInfo(mappedData['toAddressZip'] );
	if (!fromZipInfo) { 
		logger.error(`has no From ZipInfo for ${mappedData['fromAddressZip']}`);
		return;
	}
	if (!toZipInfo) { 
		logger.error(`has no To ZipInfo for ${mappedData['toAddressZip']}`);
		return;
	}
	return {
		mappedData,
		fromZipInfo,
		toZipInfo,
	};
}

type ReqBody = {
	packageCsvLength: number,
	packageCsvMap: string,
}

type OnDataParams = {
	req: AuthRequest, 
	csvData: CsvData,
	pkgAll: BatchDataType,

}
const onData = (OnDataParams: OnDataParams) => {
	const { req, csvData, pkgAll } = OnDataParams;
	const {packageCsvLength, packageCsvMap} = req.body;

	const prepared = getPreparedData(packageCsvMap, csvData);
	if (!prepared) return;

	const { mappedData, fromZipInfo, toZipInfo } = prepared;
	pkgAll.pkgBatch.push({
		userId: req.user.id,
		length: mappedData['length'],
		width: mappedData['width'],
		height: mappedData['height'],
		weight: mappedData['weight'],
		tracking: generateTrackingNumber(),
		reference: mappedData['reference'],
	});
	pkgAll.fromBatch.push({
		...fromZipInfo,
		name: mappedData['fromName'],
		address1: mappedData['fromAddress1'],
		address2: mappedData['fromAddress2'],
		zip: mappedData['fromAddressZip'],
	});
	pkgAll.toBatch.push({
		...toZipInfo,
		name: mappedData['toName'],
		address1: mappedData['toAddress1'],
		address2: mappedData['toAddress2'],
		zip: mappedData['toAddressZip'],
	})
	reportIoSocket( 'generate', req, pkgAll.pkgBatch.length, packageCsvLength);
	return;
};

export const importPackages = async (req: Request, res: Response) => {
	const { body, file } = req;

	if (!file) {
		return res.status(400).send({ message: 'No file uploaded' });
	}

	const pkgAll: BatchDataType = {
		pkgBatch: [],
		fromBatch: [],
		toBatch: [],
	}

	fs.createReadStream(file.path)
		.pipe(csv())
		.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
		.on('end', async () =>  onEndData(req, res, pkgAll))
		.on('error', (err) => {
			logger.error('Error parsing CSV:', err);
			res.status(500).send({ message: 'Error importing pkgBatch' });
		});
};

const processBatch = async (batchData: BatchDataType) => {
	const { pkgBatch, fromBatch, toBatch } = batchData;
	try {
		const fromAddresses = await Address.bulkCreate(fromBatch);
		const toAddresses = await Address.bulkCreate(toBatch);
		const packages = pkgBatch.map((pkg: PackageRoot, index: number) => ({
			...pkg,
			fromAddressId: fromAddresses[index].id,
			toAddressId: toAddresses[index].id
		}));

		await Package.bulkCreate(packages);
	} catch (error: any) {
		logger.error('Error processing batch', error);
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

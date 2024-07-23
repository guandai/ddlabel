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

type BaseData = {
	length: number,
	width: number,
	height: number,
	weight: number,
	reference: string,
	shipFromName: string,
	shipFromAddressStreet: string,
	shipFromAddressZip: string,
	shipToName: string,
	shipToAddressStreet: string,
	shipToAddressZip: string,
}

type ExtryData = {
	shipFromAddressCity: string,
	shipFromAddressState: string,
	shipToAddressCity: string,
	shipToAddressState: string,
}

type PkgData = {
	shipFromAddress: AddressData,
	shipToAddress: AddressData,
	packageSelf: PackageSelf,
}

type BatchDataType = {
	pkgBatch: PackageSelf[],
	fromBatch: AddressData[],
	toBatch: AddressData[],
}

type PackageSelf = {
	userId: number,
	length: number,
	width: number,

	height: number,
	weight: number,
	trackingNumber: string,
	reference: string,
}

type AddressData = {
	name: string,
	addressLine1: string,
	city: string,
	state: string,
	zip: string,
}

type CsvKeys = string[];
type CsvData = { [K in KeyOfCsvHeaders]: string | number };
type Mapping = { [K in KeyOfBaseData]: KeyOfCsvHeaders }; // KeyOfCsvHeaders is csv arbitrary header names

type KeyOfBaseData = keyof BaseData;
type KeyOfExtraData = keyof ExtryData;
type KeyOfPkgData = keyof PkgData;
type KeyOfCsvHeaders = keyof CsvKeys;

const BATCH_SIZE = 500;
const FIELDS: KeyOfBaseData[] = [
	'length', 'width', 'height', 'weight', 'reference',
	'shipFromName', 'shipFromAddressStreet', 'shipFromAddressZip',
	'shipToName', 'shipToAddressStreet', 'shipToAddressZip'
];

const ExtraFields: KeyOfExtraData[] = ['shipFromAddressCity', 'shipFromAddressState', 'shipToAddressCity', 'shipToAddressState'];

const defaultMapping = FIELDS.reduce((acc: Mapping, field: KeyOfBaseData) => {
	Object.assign(acc, { [field]: field });
	return acc;
}, {} as Mapping);


const getMappingData = (data: CsvData, mapping: Mapping) => {
	return FIELDS.reduce((acc: BaseData, field: KeyOfBaseData) => {
		const csvHeader = mapping[field];
		return Object.assign(acc, { [field]: data[csvHeader] });
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
		const shipFromSlice = fromBatch.slice(start, start + BATCH_SIZE);
		const shipToSlice = toBatch.slice(start, start + BATCH_SIZE);

		batchData.fromBatch = shipFromSlice;
		batchData.toBatch = shipToSlice;
		batchData.pkgBatch = pkgDataSlice;

		try {
			await processBatch(batchData);
			batchData.pkgBatch = [];
			batchData.fromBatch = [];
			batchData.toBatch = [];
			processed += pkgDataSlice.length;
			reportIoSocket( 'insert', req, processed, pkgBatch.length );
		} catch (error) {
			console.error('Error processing batch', error);
			return res.status(500).send({ message: 'Error processing batch' });
		}
	}

	res.status(200).send({ message: 'PkgBatch imported successfully' });
};

const getPreparedData = (packageCsvMap: string, data: CsvData) => {
	const mapping: Mapping = isValidJSON(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
	const mappedData = getMappingData(data, mapping);
	const fromZipInfo = getZipInfo(mappedData['shipFromAddressZip'] );
	const toZipInfo = getZipInfo(mappedData['shipToAddressZip'] );
	if (!fromZipInfo) { 
		console.error(`has no From ZipInfo for ${mappedData['shipFromAddressZip']}`);
		return;
	}
	if (!toZipInfo) { 
		console.error(`has no To ZipInfo for ${mappedData['shipToAddressZip']}`);
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
		trackingNumber: generateTrackingNumber(),
		reference: mappedData['reference'],
	});
	pkgAll.fromBatch.push({
		...fromZipInfo,
		name: mappedData['shipFromName'],
		addressLine1: mappedData['shipFromAddressStreet'],
		zip: mappedData['shipFromAddressZip'],
	});
	pkgAll.toBatch.push({
		...toZipInfo,
		name: mappedData['shipToName'],
		addressLine1: mappedData['shipToAddressStreet'],
		zip: mappedData['shipToAddressZip'],
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
			console.error('Error parsing CSV:', err);
			res.status(500).send({ message: 'Error importing pkgBatch' });
		});
};

const processBatch = async (batchData: BatchDataType) => {
	const { pkgBatch, fromBatch, toBatch } = batchData;
	try {
		const fromAddresses = await Address.bulkCreate(fromBatch);
		const toAddresses = await Address.bulkCreate(toBatch);
		const packages = pkgBatch.map((pkg: PackageSelf, index: number) => ({
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

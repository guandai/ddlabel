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
import reportToIo from '../utils/reportIo';

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
	processed: number,
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

const onData = (req:Request,  data: CsvData, pkgDatas: PackageSelf[], addFrom:AddressData[], addTo: AddressData[]) => {
	console.log(`333`);
	const { packageUserId, headerMapping } = req.body;
	const mapping: Mapping = headerMapping ? JSON.parse(headerMapping) : defaultMapping;

	const mappedData = getMappingData(data, mapping);
	const addressFrom = getZipInfo(mappedData['shipFromAddressZip'] );
	const addressTo = getZipInfo(mappedData['shipToAddressZip'] );
	if (!addressFrom || !addressTo) { 
		return null;
	}
	pkgDatas.push({
		userId: packageUserId,
		length: mappedData['length'],
		width: mappedData['width'],
		height: mappedData['height'],
		weight: mappedData['weight'],
		trackingNumber: generateTrackingNumber(),
		reference: mappedData['reference'],
	});
	addFrom.push({
		...addressFrom,
		name: mappedData['shipFromName'],
		addressLine1: mappedData['shipFromAddressStreet'],
		zip: mappedData['shipFromAddressZip'],
	});
	addTo.push({
		...addressTo,
		name: mappedData['shipToName'],
		addressLine1: mappedData['shipToAddressStreet'],
		zip: mappedData['shipToAddressZip'],
	})
};

export const importPackages = async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).send({ message: 'No file uploaded' });
	}

	const file = req.file;
	const pkgDatas: PackageSelf[] = [];
	const addFrom: AddressData[] = [];
	const addTo: AddressData[] = [];

	fs.createReadStream(file.path)
		.pipe(csv())
		.on('data', (data: CsvData) => onData(req, data, pkgDatas, addFrom, addTo))
		.on('end', async () => {
			const batchData: BatchDataType = {
				pkgBatch: [],
				fromBatch: [],
				toBatch: [],
				processed: 0,
			}

			const turns = Math.ceil(pkgDatas.length / BATCH_SIZE);

			for (let i = 0; i < turns; i++) {
				const start = i * BATCH_SIZE;
				const pkgDataSlice = pkgDatas.slice(start, start + BATCH_SIZE);
				const shipFromSlice = addFrom.slice(start, start + BATCH_SIZE);
				const shipToSlice = addTo.slice(start, start + BATCH_SIZE);

				batchData.fromBatch = shipFromSlice;
				batchData.toBatch = shipToSlice;
				batchData.pkgBatch = pkgDataSlice;

				try {
					await processBatch(batchData.pkgBatch, batchData.fromBatch, batchData.toBatch);
					batchData.pkgBatch = [];
					batchData.fromBatch = [];
					batchData.toBatch = [];
					batchData.processed += pkgDataSlice.length;
					reportToIo(req, batchData.processed, pkgDatas.length);
				} catch (error) {
					console.error('Error processing batch', error);
					return res.status(500).send({ message: 'Error processing batch' });
				}
			}

			res.status(200).send({ message: 'PkgBatch imported successfully' });
		})
		.on('error', (err) => {
			console.error('Error parsing CSV:', err);
			res.status(500).send({ message: 'Error importing pkgBatch' });
		});
};

const processBatch = async (pkgBatch: PackageSelf[], fromBatch: AddressData[], toBatch: AddressData[]) => {
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

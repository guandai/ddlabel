// backend/src/controllers/packageBatchFuntions.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import getZipInfo from '../utils/getZipInfo';
import { isValidJSON } from '../utils/errors';
import logger from '../config/logger';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord, PackageSource } from '@ddlabel/shared';

export type BatchDataType = {
	pkgBatch: PackageRoot[],
	fromBatch: AddressData[],
	toBatch: AddressData[],
}

export type PackageRoot = {
	userId: number,
	length?: number,
	width?: number,
	height?: number,
	weight: number,
	trackingNo?: string,
	referenceNo: string,
	source: PackageSource
}

type AddressData = {
	name: string,
	address1: string,
	address2?: string,
	city: string,
	state: string,
	zip: string,
}

export type CsvData = { [k: string]: string | number };

const getMappingData = (headers: CsvData, headerMapping: HeaderMapping): CsvRecord => {
	return CSV_KEYS.reduce((acc: CsvRecord, csvKey: KeyCsvRecord) => {
		const csvFileHeader = headerMapping[csvKey];
		return Object.assign(acc, { [csvKey]: !!csvFileHeader ? headers[csvFileHeader] : null });
	}, {} as CsvRecord);
}

export const getPreparedData = (packageCsvMap: string, csvData: CsvData) => {
	const headerMapping: HeaderMapping = isValidJSON(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
	const mappedData = getMappingData(csvData, headerMapping);
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

export const processBatch = async (batchData: BatchDataType) => {
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
		console.log(`errorerrorerror`, error);
		logger.error('Error processing batch', error);
		throw error;
	}
};

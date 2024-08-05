// backend/src/controllers/packageBatchFuntions.ts
import { Package, PackageCreationAttributes } from '../models/Package';
import { Address, AddressCreationAttributes } from '../models/Address';
import getZipInfo, { getFromZip, getToZip } from '../utils/getZipInfo';
import { isValidJSON, reducedError } from '../utils/errors';
import logger from '../config/logger';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord } from '@ddlabel/shared';

export type BatchDataType = {
	pkgBatch: PackageRoot[],
	shipFromBatch: AddressCreationAttributes[],
	shipToBatch: AddressCreationAttributes[],
}

export type PackageRoot = PackageCreationAttributes;
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
	const fromZipInfo = getZipInfo(getFromZip(mappedData));
	const toZipInfo = getZipInfo(getToZip(mappedData));
	if (!fromZipInfo) { 
		logger.error(`Error in getPreparedData: no fromAddressZip, ${mappedData['fromAddressZip']}`);
		return;
	}
	if (!toZipInfo) { 
		logger.error(`Error in getPreparedData: no toAddressZip, ${mappedData['toAddressZip']}`);
		return;
	}
	return {
		mappedData,
		fromZipInfo,
		toZipInfo,
	};
}

export const processBatch = async (batchData: BatchDataType) => {
	const { pkgBatch, shipFromBatch, shipToBatch } = batchData;
	try {
		const packages = await Package.bulkCreate(pkgBatch);
		packages.map((pkg, idx: number) => {
			shipFromBatch[idx].fromPackageId = pkg.id;
			shipToBatch[idx].toPackageId = pkg.id;
		});
		await Address.bulkCreate(shipFromBatch);
		await Address.bulkCreate(shipToBatch);
	} catch (error: any) {
		logger.error(`Error in processBatch: ${reducedError(error)}`);
		throw error;
	}
};

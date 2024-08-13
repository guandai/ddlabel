// backend/src/controllers/packageBatchFuntions.ts
import { Package, PackageCreationAttributes } from '../models/Package';
import { Address, AddressCreationAttributes } from '../models/Address';
import getZipInfo, { getFromAddressZip, getToAddressZip } from '../utils/getInfo';
import { isValidJSON, reducedError } from '../utils/errors';
import logger from '../config/logger';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord } from '@ddlabel/shared';
import { CsvData, PreparedData, BatchDataType } from '../types';

const getMappingData = (headers: CsvData, headerMapping: HeaderMapping): CsvRecord => {
	return CSV_KEYS.reduce((acc: CsvRecord, csvKey: KeyCsvRecord) => {
		const csvFileHeader = headerMapping[csvKey];
		return Object.assign(acc, { [csvKey]: !!csvFileHeader ? headers[csvFileHeader] : null });
	}, {} as CsvRecord);
}

export const getPreparedData = async (packageCsvMap: string, csvData: CsvData): Promise<PreparedData> => {
	const headerMapping: HeaderMapping = isValidJSON(packageCsvMap) ? JSON.parse(packageCsvMap) : defaultMapping;
	const mappedData = getMappingData(csvData, headerMapping);
	const fromZipInfo = getZipInfo(getFromAddressZip(mappedData));
	const toZipInfo = getZipInfo(getToAddressZip(mappedData));

	if (!fromZipInfo) { 
		logger.error(`Error in getPreparedData: no fromAddressZip, ${mappedData['fromAddressZip']}`);
		return { logError: { csvData, message: 'Error in getPreparedData: no fromAddressZip'}, mappedData, fromZipInfo, toZipInfo };
	}
	if (!toZipInfo) { 
		logger.error(`Error in getPreparedData: no toAddressZip, ${mappedData['toAddressZip']}`);
		return { logError: { csvData, message: 'Error in getPreparedData: no toAddressZip'}, mappedData, fromZipInfo, toZipInfo };
	}
	return {
		mappedData,
		fromZipInfo,
		toZipInfo,
		logError: null,
	};
}

export const processBatch = async (batchData: BatchDataType) => {
	const { pkgArr, shipFromArr, shipToArr } = batchData;
	try {
		const packages = await Package.bulkCreate(pkgArr);
		if (!packages) {
			throw new Error(`Error in processBatch: failed to create packages ${pkgArr}`);
		}
		packages.map((pkg, idx: number) => {
			shipFromArr[idx].fromPackageId = pkg.id;
			shipToArr[idx].toPackageId = pkg.id;
		});
		await Address.bulkCreateWithInfo(shipFromArr);
		await Address.bulkCreateWithInfo(shipToArr);
	} catch (error: any) {
		logger.error(`Error in processBatch: ${reducedError(error)}`);
		throw error;
	}
};

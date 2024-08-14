// backend/src/controllers/packageBatchFuntions.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import getZipInfo, { getFromAddressZip, getToAddressZip } from '../utils/getInfo';
import { handleSequelizeError, InvalidInputError, isValidJSON } from '../utils/errors';
import logger from '../config/logger';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord } from '@ddlabel/shared';
import { CsvData, PreparedData, BatchDataType } from '../types';
import { log } from 'console';

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
		const error = new InvalidInputError(`getPreparedData has no fromAddressZip`);
		return { csvUploadError: handleSequelizeError('missingFromZipError', error, {address: mappedData['fromAddress1']}) };
	}
	if (!toZipInfo) { 
		const error = new InvalidInputError(`getPreparedData has no toAddressZip`);
		return { csvUploadError: handleSequelizeError('missingToZipError',   error, {address: mappedData['toAddress1']}) };
	}
	return { mappedData, fromZipInfo, toZipInfo };
}

export const processBatch = async (batchData: BatchDataType) => {
	const { pkgArr, shipFromArr, shipToArr } = batchData;
	try {
		const packages = await Package.bulkCreate(pkgArr);
		packages.map((pkg, idx: number) => {
			shipFromArr[idx].fromPackageId = pkg.id;
			shipToArr[idx].toPackageId = pkg.id;
		});
		await Address.bulkCreateWithInfo(shipFromArr);
		await Address.bulkCreateWithInfo(shipToArr);
	} catch (error: any) {
		throw error;
	}
};

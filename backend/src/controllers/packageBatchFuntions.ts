// backend/src/controllers/packageBatchFuntions.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import getZipInfo, { getFromAddressZip, getToAddressZip } from '../utils/getInfo';
import { isValidJSON } from '../utils/errors';
import { CsvRecord, defaultMapping, CSV_KEYS, HeaderMapping, KeyCsvRecord } from '@ddlabel/shared';
import { CsvData, PreparedData, BatchDataType } from '../types';
import { getErrorRes } from '../utils/getErrorRes';
import { InvalidInputError } from '../utils/errorClasses';

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
		const error = new InvalidInputError(`getPreparedData has no fromAddressZip`, 'missingFromZip');
		return { csvUploadError: getErrorRes({ fnName: 'getPreparedData:missingFromZip', error, data: csvData, disableLog: true } ) };
	}
	if (!toZipInfo) { 
		const error = new InvalidInputError(`getPreparedData has no toAddressZip`, "missingToZip");
		return { csvUploadError: getErrorRes( { fnName: 'getPreparedData:missingToZip', error, data: mappedData['toAddress1'], disableLog: true } ) };
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

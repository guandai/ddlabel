// backend/src/controllers/packageBatchFuntions.ts
import { Package } from '../models/Package';
import { Address } from '../models/Address';
import getZipInfo from '../utils/getZipInfo';
import { isValidJSON } from '../utils/errors';
import logger from '../config/logger';
import { BaseData, defaultMapping, PKG_FIELDS, HeaderMapping, KeyOfBaseData, PackageSource } from '@ddlabel/shared';

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
	trackingNumber: string,
	reference: string,
	source: PackageSource
}

type AddressData = {
	name: string,
	address1: string,
	address2: string,
	city: string,
	state: string,
	zip: string,
}

type CsvFileHeaders = { [k: string]: string | number };

const BATCH_SIZE = 500;

const getMappingData = (data: CsvFileHeaders, mapping: HeaderMapping) => {
	return PKG_FIELDS.reduce((acc: BaseData, field: KeyOfBaseData) => {
		const csvHeader = mapping[field];
		return Object.assign(acc, { [field]: !!csvHeader ? data[csvHeader] : null });
	}, {} as BaseData);
}

export const getPreparedData = (packageCsvMap: string, data: CsvFileHeaders) => {
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
		logger.error('Error processing batch', error);
		throw new Error('Batch processing failed');
	}
};

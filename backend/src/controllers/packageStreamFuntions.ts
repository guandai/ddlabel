// backend/src/controllers/packageBatchFuntions.ts
import { PackageSource, AddressEnum } from '@ddlabel/shared';
import logger from '../config/logger';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { aggregateError } from '../utils/errors';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import reportIoSocket from '../utils/reportIo';
import { getPreparedData, processBatch } from './packageBatchFuntions';
import fs from 'fs';

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

const pkgAllPush = (req: AuthRequest, pkgAll: BatchDataType, prepared: any) => {
	const { user: { id: userId }, body: { packageCsvLength } } = req;
	const { mappedData, fromZipInfo, toZipInfo } = prepared;
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

	reportIoSocket({ eventName: 'generate', req, processed: pkgAll.count, total: packageCsvLength });
	return;
}

export const onData = async ({ req, csvData, pkgAll }: OnDataParams) => {
	pkgAll.count++;
	const prepared = await getPreparedData(req.body.packageCsvMap, csvData);
	if (prepared.logError) {
		pkgAll.errorArr.push(prepared.logError);
		return; // skip one data
	}

	return pkgAllPush(req, pkgAll, prepared);
};

export const onEnd = async ({ stream, req, pkgAll }: OnEndParams) => {
	const { pkgArr, shipFromArr, shipToArr } = pkgAll;
	const totalBatches = Math.ceil(pkgArr.length / BATCH_SIZE);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * BATCH_SIZE;
		const end = start + BATCH_SIZE;
		const batchData: BatchDataType = {
			count: BATCH_SIZE,  // not used
			errorArr: [],
			pkgArr: pkgArr.slice(start, end),
			shipFromArr: shipFromArr.slice(start, end),
			shipToArr: shipToArr.slice(start, end),
		};
		try {
			await processBatch(batchData);
		} catch (error: any) {
			logger.error(`Error in onEnd: ${error}`); // Log the detailed
			pkgAll.errorArr.push({ message: aggregateError(error) });
		} finally {
			reportIoSocket({ eventName: 'insert', req, processed: Math.min(end, pkgArr.length), total: pkgArr.length });
		}
	}
	stream.emit('success');

};

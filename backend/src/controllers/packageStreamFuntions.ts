// backend/src/controllers/packageBatchFuntions.ts
import { ResponseAdv, PackageSource, AddressEnum, SimpleRes, ImportPackageRes } from '@ddlabel/shared';
import logger from '../config/logger';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { reducedConstraintError } from '../utils/errors';
import { generateTrackingNo } from '../utils/generateTrackingNo';
import reportIoSocket from '../utils/reportIo';
import { getPreparedData, processBatch } from './packageBatchFuntions';
import fs from 'fs';
import { getErrorRes } from '../utils/getErrorRes';

type OnDataParams = {
	req: AuthRequest,
	csvData: CsvData,
	pkgAll: BatchDataType,
}

type OnEndParams = {
	req: AuthRequest,
} & FinishEndParams;

type FinishEndParams = {
	res: ResponseAdv<SimpleRes>,
	pkgAll: BatchDataType,
	file: Express.Multer.File,
}

const BATCH_SIZE = 100;

const pkgAllPush = (req: AuthRequest, pkgAll: BatchDataType, prepared: any) => {
	const { user: { id: userId } } = req;
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
	return;
}

export const onData = async ({ req, csvData, pkgAll }: OnDataParams) => {
	const { packageCsvMap, packageCsvLength } = req.body;
	pkgAll.processed ++;
	const prepared = await getPreparedData(packageCsvMap, csvData);
	if ('csvUploadError' in prepared) {
		const {name} = prepared.csvUploadError;
		(name in pkgAll.errorHash) ? pkgAll.errorHash[name] ++ : pkgAll.errorMap.push(prepared.csvUploadError);
	} else {
		pkgAllPush(req, pkgAll, prepared);
	}
	reportIoSocket({ eventName: 'generate', req, processed: pkgAll.processed + 1, total: packageCsvLength });
};

const finishProcessing = (params: FinishEndParams) => {
	const { res, pkgAll, file } = params;
	deleteUploadedFile(file);
	if (pkgAll.errorMap.length > 0) {
		return res.status(400).json({ errors: pkgAll.errorMap, message: `Importing Done with error: ${(pkgAll.errorMap.length)}` });
	}
	return res.json({ message: `Importing Done!` });
	// return resHeaderError('getUsers', error, req.query, res);
}

export const onEnd = async (params: OnEndParams) => {
	const { req, res, pkgAll, file } = params;
	const { pkgArr, shipFromArr, shipToArr } = pkgAll;
	const totalBatches = Math.ceil(pkgArr.length / BATCH_SIZE);

	for (let i = 0; i < totalBatches; i++) {
		const start = i * BATCH_SIZE;
		const end = start + BATCH_SIZE;
		const batchData: BatchDataType = {
			processed: Math.min(end, pkgArr.length),
			errorMap: [],
			errorHash: {},
			pkgArr: pkgArr.slice(start, end),
			shipFromArr: shipFromArr.slice(start, end),
			shipToArr: shipToArr.slice(start, end),
		};
		try {
			await processBatch(batchData);
		} catch (error: any) {
			logger.error(`Error in onEnd: ${reducedConstraintError(error)}`);
			pkgAll.errorMap.push(getErrorRes({ fnName: 'onEnd', error }));
		} finally {
			reportIoSocket({ eventName: 'insert', req, processed: batchData.processed, total: pkgArr.length });
		}
	}
	finishProcessing({ res, pkgAll, file });
};

const deleteUploadedFile = (file: Express.Multer.File) => {
	fs.unlink(file.path, (unlinkError) => {
		if (unlinkError) {
			logger.error(`Failed to delete file after process: ${unlinkError}`);
		}
	});
}

// backend/src/controllers/packageUpload.ts
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { ImportPackageRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { onData, onEnd } from './packageStreamFuntions';
import { resHeaderError } from '../utils/errors';
import { aggregateError, getErrorRes } from '../utils/getErrorRes';
import { InvalidInputError } from '../utils/errorClasses';

export const importPackages = async (req: AuthRequest, res: ResponseAdv<ImportPackageRes>) => {
	const { file } = req;
	try {
		if (!file) {
			throw new InvalidInputError('No file uploaded');
		}

		const pkgAll: BatchDataType = {
			processed: 0,
			errorMap: [],
			errorHash: { missingToZipError:0 , missingFromZipError: 0 },
			pkgArr: [],
			shipFromArr: [],
			shipToArr: [],
		}

		const readableStream = fs.createReadStream(file.path);
		// const writableStream = fs.createWriteStream('output.txt');

		readableStream.pipe(csv())
			.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
			.on('end', async () => onEnd({ req, res, pkgAll, file }))
			.on('error', (error: any) => {
				logger.error(`Error in importPackages onError: ${aggregateError(error)}`);
				pkgAll.errorMap.push(getErrorRes({ fnName: 'importPackages', error }));
			});
	} catch (error: any) {
		return resHeaderError('importPackages', error, req.file, res);
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

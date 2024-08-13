// backend/src/controllers/packageUpload.ts
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
import { ImportPackageRes, ResponseAdv } from '@ddlabel/shared';
import { AuthRequest, BatchDataType, CsvData } from '../types';
import { onData, onEnd } from './packageStreamFuntions';

export const importPackages = async (req: AuthRequest, res: ResponseAdv<ImportPackageRes>) => {
	const { file } = req;
	if (!file) {
		logger.error(`No file uploaded in importPackages`);
		return res.status(400).send({ message: 'No file uploaded' });
	}

	const pkgAll: BatchDataType = {
		count: 0,
		errorArr: [],
		pkgArr: [],
		shipFromArr: [],
		shipToArr: [],
	}

	const stream = fs.createReadStream(file.path);
	stream.pipe(csv())
		.on('data', (csvData: CsvData) => onData({ req, csvData, pkgAll }))
		.on('end', async () => onEnd({ stream, req, pkgAll }));

	// error is not on pipe
	stream.on('error', error => {
		logger.error(`Error in importPackages onError: ${error}`);
		deleteUploadedFile(file);
		pkgAll.errorArr.push({message: error.message});
		return res.status(400).send({ message: `Importing Error: ${error}` })
	});

	// success is not on pipe
	stream.on('success', (msg) => {
		console.log(`msg: ${msg}`);
		deleteUploadedFile(file);
		logger.info(`Process Done`);
		return res.json({ message: `Importing Done!` });
	});
};

const deleteUploadedFile = (file: Express.Multer.File) => {
	fs.unlink(file.path, (unlinkError) => {
		if (unlinkError) {
			logger.error(`Failed to delete file after process: ${unlinkError}`);
		}
	});
}
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

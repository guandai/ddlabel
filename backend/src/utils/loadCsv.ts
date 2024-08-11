import fs from 'fs';
import csv from 'csv-parser';

import path from 'path';

export const loadData = async <T>(fileName: string) => loadCsvData<T>(`../data/${fileName}`)
	.then((data) => data).catch((error) => {
		console.error(`Error loading ${fileName} data:`, error);
		return null;
	});

// Load CSV data
export const loadCsvData = <T>(filePath: string): Promise<T[]> => {
	const fullPath = path.resolve(__dirname, filePath);
	return new Promise((resolve, reject) => {
		const data: T[] = [];
		fs.createReadStream(fullPath)
			.pipe(csv())
			.on('data', (row: T) => {
				data.push(row);
			})
			.on('end', () => {
				resolve(data);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
};

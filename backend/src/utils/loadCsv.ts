import fs from 'fs';
import csv from 'csv-parser';

// Load CSV data
export const loadCsvData = <DataStructure>(filePath: string): Promise<DataStructure[]> => {
	return new Promise((resolve, reject) => {
	  const data: DataStructure[] = [];
	  fs.createReadStream(filePath)
		.pipe(csv())
		.on('data', (row: DataStructure) => {
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

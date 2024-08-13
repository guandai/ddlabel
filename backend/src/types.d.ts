import { Request } from 'express';
export type SimpleType = {
	t: string
}  

export interface AuthRequest extends Request {
	user?: UserAttributes;
}

export type BatchDataType = {
	count: number,
	errorArr: (CsvLogError | null)[],
	pkgArr: PackageRoot[],
	shipFromArr: AddressCreationAttributes[],
	shipToArr: AddressCreationAttributes[],
}

export type PackageRoot = PackageCreationAttributes;
export type CsvData = { [k: string]: string | number };

export type CsvLogError = {
	csvData?: CsvData,
	message: string,
}
export type PreparedData = {
	mappedData: CsvRecord,
	fromZipInfo: any,
	toZipInfo: any,
	logError: CsvLogError | null,
}

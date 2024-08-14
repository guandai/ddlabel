import { Request } from 'express';

type PackageRoot = PackageCreationAttributes;
export interface AuthRequest extends Request {
	user?: UserAttributes;
}

export type BatchDataType = {
	processed: number,
	errorMap: ErrorRes[],
	pkgArr: PackageRoot[],
	shipFromArr: AddressCreationAttributes[],
	shipToArr: AddressCreationAttributes[],
}


export type CsvData = { [k: string]: string | number };
export type PreparedData = {
	mappedData: CsvRecord,
	fromZipInfo: any,
	toZipInfo: any,
} | {
	csvUploadError: ErrorRes,
}

export type ErrorRes = {
	name: string,
	original: any;
	data: unknown;
	status: number;
	message: string;
	errors?: ValidationErrorItem[];
	parent?: Error;
	sql?: string;
	where?: Record<string, unknown>;
	stack?: any;
	lastFn?: string;
}

import { Response } from 'express';
type CsvRecordRequired = {
	weight: number,
	fromName: string,
	fromAddress1: string,
	toName: string,
	toAddress1: string,
}

export type BeansStatus = 'FINISHED' | 'FAILED' | 'MISLOAD' | 'DELETED' | 'NEW' | 'IN_PROCESS' | 'NOLOCATION' | 'N/A';

type CsvRecordOptional = {
	referenceNo?: string,
	fromAddressZip?: string,
	toAddressZip?: string,
	trackingNo?: string,
	length?: number,
	width?: number,
	height?: number,
	fromAddress2?: string,
	toAddress2?: string,
}

export type CsvRecord = CsvRecordOptional & CsvRecordRequired;
export type KeyCsvRecord = keyof CsvRecord;

export type HeaderMapping = { [k in keyof CsvRecord]: string | undefined };

export type PortInfo = {
	zip: string;
	proposal: string;
	sortCode: string;
	startZip: string;
	state: string;
	city: string;
};

export type ZipInfo = {
	zip: string;
	city: string;
	state: string;
	county?: string;
};

export type SimpleRes = {
	message: string;
	success?: false;
	error?: Error;
};

export type ResponseAdv<T> = Response<T | SimpleRes>;

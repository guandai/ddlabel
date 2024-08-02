import { Response } from 'express';
type CsvRecordRequired = {
    weight: number;
    referenceNo: string;
    fromName: string;
    fromAddressZip: string;
    fromAddress1: string;
    toName: string;
    toAddressZip: string;
    toAddress1: string;
};
type CsvRecordOptional = {
    trackingNo?: string;
    length?: number;
    width?: number;
    height?: number;
    fromAddress2?: string;
    toAddress2?: string;
};
export type CsvRecord = CsvRecordOptional & CsvRecordRequired;
export type KeyCsvRecord = keyof CsvRecord;
export type HeaderMapping = {
    [k in keyof CsvRecord]: string | undefined;
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


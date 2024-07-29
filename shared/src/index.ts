export enum AddressEnum {
	user = 'user',
	package = 'package'
}

export const FIELDS: KeyOfBaseData[] = [
	'length', 'width', 'height', 'weight', 'reference',
	'fromName', 'fromAddress1', 'fromAddress2', 'fromAddressZip',
	'toName', 'toAddress1', 'toAddress2', 'toAddressZip'
];

export type FullRateRsp = {
	totalCost: number;
}

export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';

export type FullRateParam = {
	weight: number;
	weightUnit: WeightUnit;
	length: number;
	width: number;
	height: number;
	volumeUnit: VolumeUnit;
	zone: number;
};

export type BaseData = {
	length: number,
	width: number,
	height: number,
	weight: number,
	reference: string,
	fromName: string,
	fromAddress1: string,
	fromAddress2: string,
	fromAddressZip: string,
	toName: string,
	toAddress1: string,
	toAddress2: string,
	toAddressZip: string,
}

export type KeyOfBaseData = keyof BaseData;
export type HeaderMapping = { [k in KeyOfBaseData]: KeyOfBaseData | string | null };
